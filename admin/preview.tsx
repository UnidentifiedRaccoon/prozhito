import {useEffect,useMemo,useState} from "react";
import {createRoot} from "react-dom/client";
import {ReaderApp} from "../src/apps/cloud/ReaderApp";
import {CloudContentContext} from "../src/content/cloudContent";
import {toCollection,type Publication} from "../src/apps/cloud/api";
import "../src/styles.css";
function Preview(){
  const [publication,setPublication]=useState<Publication|null>(null);
  useEffect(()=>{const receive=(event:MessageEvent)=>{
    if(event.origin!==window.location.origin||event.source!==window.parent||event.data?.type!=="prozhito-editor-preview")return;
    try{toCollection(event.data.publication);setPublication(event.data.publication);}catch{setPublication(null);}
  };window.addEventListener("message",receive);window.parent.postMessage({type:"prozhito-preview-ready"},window.location.origin);return()=>window.removeEventListener("message",receive);},[]);
  const collection=useMemo(()=>publication?toCollection(publication):null,[publication]);
  const documents=useMemo(()=>new Map(publication?.items.map(i=>[i.document.id,i.document])),[publication]);
  return collection?<CloudContentContext value={documents}><ReaderApp collection={collection}/></CloudContentContext>:<p>Ожидаем проверенный черновик…</p>;
}
createRoot(document.getElementById("root")!).render(<Preview/>);
