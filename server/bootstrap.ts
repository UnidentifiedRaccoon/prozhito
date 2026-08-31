import Fastify from "fastify";
import {readFileSync} from "node:fs";
import {migrate,importSeed} from "./migrate.ts";
import {makePool} from "./db.ts";
import {validatePublication} from "./content.ts";
// This image entrypoint is deployed only as a private, short-lived IAM container.
// It accepts no SQL, password, path or content from the request.
const app=Fastify({logger:false,bodyLimit:1024});
app.post("/bootstrap",async(_request,reply)=>{
  try {
    await migrate();
    const result=await importSeed(JSON.parse(readFileSync(new URL("./seed.json",import.meta.url),"utf8")),process.env.EDITOR_BOOTSTRAP_PASSWORD??"");
    return result;
  } catch {return reply.code(409).send({code:"bootstrap_failed_or_already_imported"});}
});
app.get("/verify",async(_request,reply)=>{
  const pool=makePool();
  try {
    const result=await pool.query("SELECT (SELECT count(*)::int FROM prozhito.levels) levels,(SELECT count(*)::int FROM prozhito.sections) sections,(SELECT count(*)::int FROM prozhito.editors) editors");
    const actual=await pool.query("SELECT r.document FROM prozhito.current_publication c JOIN prozhito.publication_items i ON i.publication_id=c.publication_id JOIN prozhito.revisions r ON r.id=i.revision_id");
    const expected=JSON.parse(readFileSync(new URL("./seed.json",import.meta.url),"utf8"));
    return {...result.rows[0],contentMatchesSeed:JSON.stringify(validatePublication(actual.rows.map(row=>row.document)))===JSON.stringify(validatePublication(expected.documents))};
  } catch {return reply.code(503).send({code:"not_ready"});} finally{await pool.end();}
});
app.setErrorHandler((_error,_request,reply)=>reply.code(503).send({code:"unavailable"}));
await app.listen({host:"0.0.0.0",port:Number(process.env.PORT??8080)});
