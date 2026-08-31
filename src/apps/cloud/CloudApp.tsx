import { useEffect,useMemo,useState } from "react";
import {ReaderApp} from "./ReaderApp";
import { CloudContentContext } from "../../content/cloudContent";
import { api,toCollection,type Publication } from "./api";
import { useServiceStatus } from "./useServiceStatus";
import { Maintenance } from "./Maintenance";
export default function CloudApp() {
  const status=useServiceStatus();
  const [publication,setPublication]=useState<Publication|null>(null);
  const [error,setError]=useState(false);
  const open=status?.mode==="open";
  useEffect(()=>{
    if(!open || publication)return;
    const controller=new AbortController();let active=true;
    void api<Publication>("/api/v1/content",{signal:controller.signal}).then(value=>{toCollection(value);if(active){setPublication(value);setError(false);}}).catch(()=>{if(active)setError(true);});
    return ()=>{active=false;controller.abort();};
  },[open,publication]);
  const collection=useMemo(()=>publication?toCollection(publication):null,[publication]);
  const documents=useMemo(()=>new Map(publication?.items.map(item=>[item.document.id,item.document])),[publication]);
  return <>{!open || !collection || error?<Maintenance status={error?null:status}/>:null}
    {collection?<div hidden={!open||error}><CloudContentContext value={documents}><ReaderApp collection={collection}/></CloudContentContext></div>:null}</>;
}
