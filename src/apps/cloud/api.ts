import { documentSchema, validatePublication, type ContentDocument } from "../../../server/content";
import type { SectionCollection } from "../../content/sections";
export interface Publication {
  id:string;sequence:number;createdAt:string;
  levels:{id:string;number:number;title:string}[];
  items:{revisionId:string;document:ContentDocument}[];
}
export interface ServiceStatus {
  serverTime:string;mode:"open"|"scheduled_maintenance"|"temporarily_unavailable";
  ready:boolean;nextOpenAt:string;nextCloseAt:string;editorWarning:boolean;scheduledMaintenance:boolean;
}
export async function api<T>(path:string,init?:RequestInit):Promise<T> {
  const timeout=AbortSignal.timeout(15000);
  const response=await fetch(path,{...init,cache:"no-store",credentials:"same-origin",signal:init?.signal?AbortSignal.any([init.signal,timeout]):timeout});
  const result=await response.json();
  if(!response.ok)throw Object.assign(new Error(result.code??"temporarily_unavailable"),{status:response.status,details:result});
  return result;
}
export function toCollection(publication:Publication):SectionCollection {
  const documents=validatePublication(publication.items.map(item=>item.document));
  if(publication.levels.length!==6 || publication.levels.some((l,i)=>l.id!==`L0${i+1}` || l.number!==i+1))throw new Error("Неверный manifest уровней");
  const sections=documents.map(doc=>({...doc,sourcePath:`publication:${publication.id}`}));
  const sectionsById=new Map(sections.map(section=>[section.id,section]));
  return {ok:true,sections,sectionsById,levels:publication.levels.map(level=>({...level,sections:sections.filter(section=>section.id.startsWith(level.id))}))};
}
export { documentSchema };
export type { ContentDocument };
