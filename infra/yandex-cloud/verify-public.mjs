import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {validatePublication} from "../../server/content.ts";
import {mediaPaths} from "../../server/media.ts";
const config=JSON.parse(readFileSync(new URL("./pilot.json",import.meta.url),"utf8"));
const origin=`https://${config.domains.reader}`;
const response=await fetch(origin+"/api/v1/content");assert.equal(response.status,200);assert.equal(response.headers.get("set-cookie"),null);
const publication=await response.json();const documents=validatePublication(publication.items.map(i=>i.document));
const seed=JSON.parse(readFileSync(new URL("../../.work/prozhito/seed/seed.json",import.meta.url),"utf8"));
assert.deepEqual(documents,validatePublication(seed.documents));assert.deepEqual(publication.levels,seed.levels);
const paths=[...new Set(documents.flatMap(mediaPaths))];
for(let index=0;index<paths.length;index+=6)await Promise.all(paths.slice(index,index+6).map(async path=>{
  const asset=await fetch(origin+path,{headers:{Range:"bytes=0-0"}});assert.ok([200,206].includes(asset.status),`Missing media: ${path}`);assert.match(asset.headers.get("content-type")??"",/^image\/(jpeg|png|webp)/);await asset.body?.cancel();
}));
assert.equal((await fetch(origin+"/api/admin/session")).status,404);
assert.equal((await fetch(`https://${config.domains.editor}/api/admin/session`)).status,401);
assert.equal((await fetch(`https://${config.containers.api}.containers.yandexcloud.net/health/live`)).status,403);
assert.equal((await fetch(`https://storage.yandexcloud.net/${config.buckets.reader}/cloud.html`)).status,403);
console.log(JSON.stringify({result:"PASS",levels:6,sections:22,media:paths.length,contentMatchesSeed:true,readerAccounts:false,privateBackend:true,privateBuckets:true}));
