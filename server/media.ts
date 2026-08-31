import {readFileSync} from "node:fs";
import type {ContentDocument} from "./content.ts";
let allowed:Set<string>|undefined;
export function mediaPaths(doc:ContentDocument):string[]{return [...Object.values(doc.visuals),...(doc.editorial?[doc.editorial.story,doc.editorial.analysis]:[])].map(a=>a.src);}
export function hasKnownMedia(doc:ContentDocument){
  if(!allowed){
    const path=process.env.PROZHITO_LOCAL_TEST==="1"?"../.work/prozhito/seed/seed.json":"./seed.json";
    const seed=JSON.parse(readFileSync(new URL(path,import.meta.url),"utf8")) as {documents:ContentDocument[]};
    allowed=new Set(seed.documents.flatMap(mediaPaths));
  }
  return mediaPaths(doc).every(path=>allowed!.has(path));
}
