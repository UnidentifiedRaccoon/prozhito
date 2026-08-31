import {useEffect,useRef,useState} from "react";
import type {Publication,ContentDocument} from "../src/apps/cloud/api";
export function ReaderPreview({publication,document}:{publication:Publication;document:ContentDocument}) {
  const frame=useRef<HTMLIFrameElement>(null);
  const [editorial,setEditorial]=useState(false);
  const send=()=>frame.current?.contentWindow?.postMessage({type:"prozhito-editor-preview",publication:{...publication,items:publication.items.map(item=>item.document.id===document.id?{...item,document}:item)}},window.location.origin);
  useEffect(()=>{const ready=(event:MessageEvent)=>{if(event.origin===window.location.origin&&event.source===frame.current?.contentWindow&&event.data?.type==="prozhito-preview-ready")send();};window.addEventListener("message",ready);send();return()=>window.removeEventListener("message",ready);},[publication,document]);
  return <><p className="notice">Черновик в настоящем интерфейсе сайта. Он ещё не опубликован. Переключайтесь между историей и решением внутри просмотра.</p>{document.editorial?<label className="review-check"><input type="checkbox" checked={editorial} onChange={e=>setEditorial(e.target.checked)}/>Редакционная версия с упражнением</label>:null}<iframe key={`${document.id}:${editorial}`} title="Предпросмотр читательского приложения" ref={frame} onLoad={send} src={`/preview.html#/${editorial?"editorial-v2/":""}section/${document.id.toLowerCase()}/story`} style={{width:"100%",height:850,border:"1px solid #cfc8bb",background:"#fff"}}/></>;
}
