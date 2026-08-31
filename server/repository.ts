import { randomUUID } from "node:crypto";
import type pg from "pg";
import { transaction } from "./db.ts";
import { documentSchema, validatePublication, type ContentDocument } from "./content.ts";
import {hasKnownMedia} from "./media.ts";

export class ApiError extends Error {
  statusCode: number;
  code: string;
  constructor(statusCode: number, code: string) { super(code); this.statusCode=statusCode; this.code=code; }
}
export class Repository {
  pool: pg.Pool;
  constructor(pool: pg.Pool) { this.pool=pool; }
  async ready() {
    const result = await this.pool.query("SELECT count(*)::integer AS count FROM prozhito.current_publication c JOIN prozhito.publication_items i ON i.publication_id=c.publication_id");
    return result.rows[0]?.count === 22;
  }
  async published() {
    const result = await this.pool.query(`SELECT p.id,p.sequence::integer,p.created_at,
      (SELECT jsonb_agg(jsonb_build_object('id',l.id,'number',l.position,'title',l.title) ORDER BY l.position) FROM prozhito.levels l) levels,
      jsonb_agg(jsonb_build_object('revisionId',r.id,'document',r.document) ORDER BY s.level_id,s.position) items
      FROM prozhito.current_publication c JOIN prozhito.publications p ON p.id=c.publication_id
      JOIN prozhito.publication_items i ON i.publication_id=p.id JOIN prozhito.revisions r ON r.id=i.revision_id
      JOIN prozhito.sections s ON s.id=i.section_id GROUP BY p.id`);
    const row = result.rows[0];
    if (!row || row.items.length !== 22) throw new ApiError(503,"content_unavailable");
    return { id: row.id, sequence: row.sequence, createdAt: row.created_at, levels: row.levels, items: row.items };
  }
  async draft(id: string) {
    const result = await this.pool.query(`SELECT i.revision_id AS "baseRevisionId",COALESCE(d.version,0) version,
      COALESCE(d.document,r.document) document, d.base_revision_id AS "draftBaseRevisionId"
      FROM prozhito.current_publication c JOIN prozhito.publication_items i ON i.publication_id=c.publication_id
      JOIN prozhito.revisions r ON r.id=i.revision_id LEFT JOIN prozhito.drafts d ON d.section_id=i.section_id WHERE i.section_id=$1`,[id]);
    const row = result.rows[0];
    if (!row) throw new ApiError(404,"section_not_found");
    return {version:row.version,document:row.document,baseRevisionId:row.draftBaseRevisionId ?? row.baseRevisionId};
  }
  async save(id: string, editor: string, body: {version:number;baseRevisionId:string;document:ContentDocument}) {
    const doc = documentSchema.parse(body.document);
    if(!hasKnownMedia(doc))throw new ApiError(400,"unknown_media");
    if (doc.id !== id) throw new ApiError(400,"section_id_mismatch");
    return transaction(this.pool, async db => {
      // Serialize draft creation, including the initially absent row.
      await db.query("SELECT pg_advisory_xact_lock(hashtext('prozhito-section:' || $1))",[id]);
      const current = await db.query(`SELECT d.version,d.base_revision_id,i.revision_id FROM prozhito.current_publication c
        JOIN prozhito.publication_items i ON i.publication_id=c.publication_id
        LEFT JOIN prozhito.drafts d ON d.section_id=i.section_id WHERE i.section_id=$1`,[id]);
      const row = current.rows[0];
      if (!row) throw new ApiError(404,"section_not_found");
      if ((row.version ?? 0) !== body.version || row.revision_id !== body.baseRevisionId || (row.base_revision_id && row.base_revision_id !== body.baseRevisionId)) throw new ApiError(409,"revision_conflict");
      await db.query(`INSERT INTO prozhito.drafts(section_id,base_revision_id,version,document,editor_id) VALUES($1,$2,1,$3,$4)
        ON CONFLICT(section_id) DO UPDATE SET version=prozhito.drafts.version+1,document=$3,editor_id=$4,updated_at=now()`,[id,body.baseRevisionId,doc,editor]);
      await db.query("INSERT INTO prozhito.editorial_audit(editor_id,action,section_id) VALUES($1,'save_draft',$2)",[editor,id]);
      return {version: body.version+1, baseRevisionId: body.baseRevisionId, document: doc};
    });
  }
  async publish(id: string, editor: string, version: number, reason: string) {
    return transaction(this.pool, async db => {
      await db.query("SELECT pg_advisory_xact_lock(hashtext('prozhito-section:' || $1))",[id]);
      const head = await db.query("SELECT publication_id FROM prozhito.current_publication FOR UPDATE");
      const publicationId = head.rows[0]?.publication_id;
      const draft = (await db.query("SELECT * FROM prozhito.drafts WHERE section_id=$1",[id])).rows[0];
      const items = (await db.query(`SELECT i.section_id,i.revision_id,r.document FROM prozhito.publication_items i
        JOIN prozhito.revisions r ON r.id=i.revision_id WHERE i.publication_id=$1`,[publicationId])).rows;
      if (!draft || draft.version !== version || items.find(i=>i.section_id===id)?.revision_id !== draft.base_revision_id) throw new ApiError(409,"revision_conflict");
      validatePublication(items.map(i=>i.section_id===id ? draft.document : i.document));
      const revisionId = randomUUID(); const nextId = randomUUID();
      await db.query("INSERT INTO prozhito.revisions(id,section_id,document,editor_id) VALUES($1,$2,$3,$4)",[revisionId,id,draft.document,editor]);
      await db.query("INSERT INTO prozhito.publications(id,editor_id,reason) VALUES($1,$2,$3)",[nextId,editor,reason]);
      await db.query(`INSERT INTO prozhito.publication_items(publication_id,section_id,revision_id)
        SELECT $1,section_id,CASE WHEN section_id=$2 THEN $3::uuid ELSE revision_id END
        FROM prozhito.publication_items WHERE publication_id=$4`,[nextId,id,revisionId,publicationId]);
      await db.query("UPDATE prozhito.current_publication SET publication_id=$1",[nextId]);
      await db.query("DELETE FROM prozhito.drafts WHERE section_id=$1",[id]);
      await db.query("INSERT INTO prozhito.editorial_audit(editor_id,action,section_id,publication_id) VALUES($1,'publish',$2,$3)",[editor,id,nextId]);
      return {id: nextId,revisionId};
    });
  }
  async history() {
    return (await this.pool.query("SELECT id,sequence::integer,reason,created_at AS \"createdAt\" FROM prozhito.publications ORDER BY sequence DESC LIMIT 50")).rows;
  }
  async discard(id:string,editor:string,version:number) {
    return transaction(this.pool,async db=>{
      await db.query("SELECT pg_advisory_xact_lock(hashtext('prozhito-section:' || $1))",[id]);
      const removed=await db.query("DELETE FROM prozhito.drafts WHERE section_id=$1 AND version=$2 RETURNING section_id",[id,version]);
      if(!removed.rowCount)throw new ApiError(409,"revision_conflict");
      await db.query("INSERT INTO prozhito.editorial_audit(editor_id,action,section_id) VALUES($1,'discard_draft',$2)",[editor,id]);
      return {ok:true};
    });
  }
  async rollback(target: string, expectedCurrent: string, editor: string, reason: string) {
    return transaction(this.pool, async db => {
      const head = await db.query("SELECT publication_id FROM prozhito.current_publication FOR UPDATE");
      if (head.rows[0]?.publication_id !== expectedCurrent) throw new ApiError(409,"revision_conflict");
      const docs = (await db.query("SELECT r.document FROM prozhito.publication_items i JOIN prozhito.revisions r ON r.id=i.revision_id WHERE i.publication_id=$1",[target])).rows;
      if (docs.length !== 22) throw new ApiError(404,"publication_not_found");
      validatePublication(docs.map(d=>d.document));
      const id = randomUUID();
      await db.query("INSERT INTO prozhito.publications(id,editor_id,reason) VALUES($1,$2,$3)",[id,editor,reason]);
      await db.query("INSERT INTO prozhito.publication_items SELECT $1,section_id,revision_id FROM prozhito.publication_items WHERE publication_id=$2",[id,target]);
      await db.query("UPDATE prozhito.current_publication SET publication_id=$1",[id]);
      await db.query("INSERT INTO prozhito.editorial_audit(editor_id,action,publication_id) VALUES($1,'rollback',$2)",[editor,id]);
      return {id};
    });
  }
}
