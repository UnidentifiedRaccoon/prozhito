import {useEffect,useState} from "react";
import {api,message,write} from "./api";
import type {Session} from "./Login";
import {SectionForm} from "./SectionForm";
import {ConfirmAction,type Confirmation} from "./ConfirmAction";
import {documentSchema,type ContentDocument,type Publication} from "../src/apps/cloud/api";
type Draft={version:number;baseRevisionId:string;document:ContentDocument};
type History={id:string;sequence:number;reason:string;createdAt:string}[];
export function Editor({session,onLogout}:{session:Session;onLogout:()=>void}) {
  const [publication,setPublication]=useState<Publication|null>(null);
  const [selected,setSelected]=useState("L01-S01");const [level,setLevel]=useState("L01");
  const [draft,setDraft]=useState<Draft|null>(null);const [dirty,setDirty]=useState(false);
  const [busy,setBusy]=useState(false);const [notice,setNotice]=useState("");const [error,setError]=useState("");
  const [history,setHistory]=useState<History|null>(null);
  const [confirmation,setConfirmation]=useState<Confirmation|null>(null);
  useEffect(()=>{void api<Publication>("/api/admin/content").then(setPublication).catch(e=>setError(message(e)));},[]);
  useEffect(()=>{let active=true;setDraft(null);setError("");setNotice("");void api<Draft>(`/api/admin/sections/${selected}`).then(d=>{documentSchema.parse(d.document);if(active){setDraft(d);setDirty(false);}}).catch(e=>{if(active)setError(message(e));});return ()=>{active=false;};},[selected]);
  useEffect(()=>{const warn=(event:BeforeUnloadEvent)=>{if(dirty){event.preventDefault();event.returnValue="";}};window.addEventListener("beforeunload",warn);return()=>window.removeEventListener("beforeunload",warn);},[dirty]);
  function select(id:string) {const go=()=>{setSelected(id);setDirty(false);setHistory(null);};if(dirty)setConfirmation({title:"Перейти к другой истории?",description:"Несохранённые правки будут потеряны.",run:go});else go();}
  async function save() {
    if(!draft)return;setBusy(true);setError("");setNotice("");
    try {documentSchema.parse(draft.document);const saved=await write<Draft>(`/api/admin/sections/${selected}`,session.csrfToken,draft,"PUT");setDraft(saved);setDirty(false);setNotice("Черновик сохранён. Сайт пока не изменился.");}
    catch(error){setError(message(error));}finally{setBusy(false);}
  }
  async function publish(reason:string) {
    if(!draft || dirty)return;
    if(!reason?.trim())return;setBusy(true);setError("");
    try {await write(`/api/admin/sections/${selected}/publish`,session.csrfToken,{version:draft.version,reason});
      const [next,current]=await Promise.all([api<Draft>(`/api/admin/sections/${selected}`),api<Publication>("/api/admin/content")]);
      setDraft(next);setPublication(current);setNotice("Опубликовано. Открытый сайт получит новую редакцию при загрузке.");
    }catch(error){setError(message(error));}finally{setBusy(false);}
  }
  async function rollback(id:string,reason:string) {
    if(!publication || !reason.trim())return;
    setBusy(true);try {await write("/api/admin/rollback",session.csrfToken,{target:id,expectedCurrent:publication.id,reason});setPublication(await api<Publication>("/api/admin/content"));setDraft(await api<Draft>(`/api/admin/sections/${selected}`));setHistory(await api<History>("/api/admin/publications"));setDirty(false);setNotice("Восстановлена выбранная публикация.");}catch(error){setError(message(error));}finally{setBusy(false);}
  }
  function download() {if(!draft)return;const url=URL.createObjectURL(new Blob([JSON.stringify(draft,null,2)],{type:"application/json"}));const a=document.createElement("a");a.href=url;a.download=`${selected}-draft.json`;a.click();URL.revokeObjectURL(url);}
  async function discard(){
    if(!draft)return;
    setBusy(true);try{await write(`/api/admin/sections/${selected}/discard`,session.csrfToken,{version:draft.version});setDraft(await api<Draft>(`/api/admin/sections/${selected}`));setDirty(false);setError("");setNotice("Открыта актуальная опубликованная версия.");}catch(e){setError(message(e));}finally{setBusy(false);}
  }
  return <>
    {confirmation?<ConfirmAction value={confirmation} onClose={()=>setConfirmation(null)}/>:null}
    <header className="topbar"><span className="brand">Прожито</span><span className="role">Редактор</span><button disabled={busy} onClick={()=>{if(dirty)setConfirmation({title:"Выйти из редактора?",description:"Несохранённые правки будут потеряны.",run:onLogout});else onLogout();}}>Выйти</button></header>
    <div className="workspace"><aside><h2>Истории</h2><label className="sr-only" htmlFor="level">Уровень</label><select disabled={busy} id="level" value={level} onChange={e=>setLevel(e.target.value)}>{publication?.levels.map(l=><option value={l.id} key={l.id}>{l.title}</option>)}</select><nav aria-label="Истории уровня">{publication?.items.filter(i=>i.document.id.startsWith(level)).map(({document:doc})=><button disabled={busy} key={doc.id} aria-current={doc.id===selected?"page":undefined} onClick={()=>select(doc.id)}><span>{String(doc.number).padStart(2,"0")}</span>{doc.title}</button>)}</nav></aside>
    <main className="editor">{draft?<><h1>{draft.document.title}</h1><p className="revision">{selected} · Редакция {publication?.sequence??1}{dirty?" · Есть несохранённые правки":""}</p>
      <fieldset disabled={busy} style={{border:0,padding:0,margin:0,minWidth:0,display:"block"}}><SectionForm key={selected} publication={publication} document={draft.document} onChange={document=>{setDraft({...draft,document});setDirty(true);setNotice("");}}/></fieldset>
      <p className="hint">Сохранение черновика не меняет опубликованный сайт.</p>
      {error?<div className="error" role="alert">{error}<button onClick={download}>Скачать копию правок</button>{draft.version>0?<button disabled={busy} onClick={()=>setConfirmation({title:"Удалить черновик?",description:"Откроется актуальная публикация. Сначала скачайте копию, если правки нужны.",run:()=>void discard()})}>Удалить черновик и открыть публикацию</button>:null}</div>:null}
      {notice?<p className="success" role="status">{notice}</p>:null}
      <div className="actions"><button onClick={()=>void save()} disabled={busy||!dirty}>Сохранить черновик</button><button className="primary" onClick={()=>setConfirmation({title:"Опубликовать изменения?",description:"Новая редакция станет доступна всем читателям при загрузке сайта.",reasonRequired:true,run:reason=>void publish(reason)})} disabled={busy||dirty||draft.version===0}>Опубликовать</button><button disabled={busy} className="text-button" onClick={()=>void api<History>("/api/admin/publications").then(setHistory).catch(e=>setError(message(e)))}>История публикаций</button></div>
      {history?<section className="history"><h2>История публикаций</h2><ol>{history.map(item=><li key={item.id}><strong>Публикация {item.sequence}</strong><time>{new Date(item.createdAt).toLocaleString("ru-RU",{timeZone:"Europe/Moscow"})} МСК</time><p>{item.reason}</p><button disabled={busy||dirty||item.id===publication?.id} onClick={()=>setConfirmation({title:"Вернуть публикацию?",description:"Вся программа вернётся к выбранной версии. Черновики останутся отдельно.",reasonRequired:true,run:reason=>void rollback(item.id,reason)})}>Вернуть эту публикацию</button></li>)}</ol></section>:null}
    </>:<p role="status">{error||"Загружаем материал…"}</p>}</main></div>
  </>;
}
