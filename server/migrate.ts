import { readFileSync, readdirSync } from "node:fs";
import { randomUUID, createHash } from "node:crypto";
import { makePool, transaction } from "./db.ts";
import { validatePublication } from "./content.ts";
import { hashPassword } from "./auth.ts";

export async function migrate() {
  const pool=makePool();
  try {
    await transaction(pool,async db=>{
      await db.query("SELECT pg_advisory_xact_lock(791733001)");
      await db.query("CREATE SCHEMA IF NOT EXISTS prozhito");
      await db.query("CREATE TABLE IF NOT EXISTS prozhito.schema_migrations(name text PRIMARY KEY,checksum text NOT NULL,applied_at timestamptz NOT NULL DEFAULT now())");
      for(const name of readdirSync(new URL("./migrations",import.meta.url)).filter(n=>n.endsWith(".sql")).sort()) {
        const sql=readFileSync(new URL(`./migrations/${name}`,import.meta.url),"utf8");
        const checksum=createHash("sha256").update(sql).digest("hex");
        const applied=(await db.query("SELECT checksum FROM prozhito.schema_migrations WHERE name=$1",[name])).rows[0];
        if(applied) { if(applied.checksum!==checksum)throw new Error("Applied migration was modified");continue; }
        await db.query(sql);
        await db.query("INSERT INTO prozhito.schema_migrations(name,checksum) VALUES($1,$2)",[name,checksum]);
      }
    });
  } finally {await pool.end();}
}
export async function importSeed(seed: {levels:{id:string;number:number;title:string}[];documents:unknown[]}, editorPassword:string) {
  const documents=validatePublication(seed.documents);
  if(!editorPassword || editorPassword.length<20)throw new Error("Bootstrap credentials required");
  const passwordHash=await hashPassword(editorPassword);
  const pool=makePool();
  try { return await transaction(pool,async db=>{
    await db.query("SELECT pg_advisory_xact_lock(791733001)");
    if(Number((await db.query("SELECT count(*) FROM prozhito.sections")).rows[0].count)!==0)throw new Error("Import requires an empty content database");
    const editorId=randomUUID(); const publicationId=randomUUID();
    await db.query("INSERT INTO prozhito.editors(id,login,password_hash) VALUES($1,'editor',$2)",[editorId,passwordHash]);
    for(const level of seed.levels)await db.query("INSERT INTO prozhito.levels(id,position,title) VALUES($1,$2,$3)",[level.id,level.number,level.title]);
    await db.query("INSERT INTO prozhito.publications(id,reason) VALUES($1,'Проверенный импорт канонических Markdown и медиа')",[publicationId]);
    for(const doc of documents) {
      const revision=randomUUID();
      await db.query("INSERT INTO prozhito.sections(id,level_id,position) VALUES($1,$2,$3)",[doc.id,doc.id.slice(0,3),Number(doc.id.slice(-2))]);
      await db.query("INSERT INTO prozhito.revisions(id,section_id,document) VALUES($1,$2,$3)",[revision,doc.id,doc]);
      await db.query("INSERT INTO prozhito.publication_items VALUES($1,$2,$3)",[publicationId,doc.id,revision]);
    }
    await db.query("INSERT INTO prozhito.current_publication(singleton,publication_id) VALUES(true,$1)",[publicationId]);
    return {sections:documents.length,publicationId};
  }); } finally {await pool.end();}
}
