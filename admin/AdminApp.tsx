import {useEffect,useState} from "react";
import {useServiceStatus} from "../src/apps/cloud/useServiceStatus";
import {Maintenance} from "../src/apps/cloud/Maintenance";
import {Login,type Session} from "./Login";
import {Editor} from "./Editor";
import {api,write} from "./api";
export function AdminApp() {
  const status=useServiceStatus();const [session,setSession]=useState<Session|null>(null);const [loaded,setLoaded]=useState(false);
  const [error,setError]=useState("");
  const open=status?.mode==="open";
  useEffect(()=>{if(!open||loaded)return;let active=true;void api<Session>("/api/admin/session").then(s=>{if(active)setSession(s);}).catch(()=>{}).finally(()=>{if(active)setLoaded(true);});return()=>{active=false;};},[open,loaded]);
  async function logout(){if(!session)return;try {await write("/api/admin/logout",session.csrfToken,{});setSession(null);setError("");}catch {setError("Не удалось завершить сессию. Повторите выход, когда сервис будет доступен.");}}
  return <>{!open?<Maintenance status={status}/>:null}<div hidden={!open}>
    {error?<p className="error" role="alert">{error}</p>:null}
    {status?.editorWarning?<p className="night-warning" role="alert">В 00:00 МСК начнутся технические работы. Сохраните черновик до полуночи.</p>:null}
    {loaded?(session?<Editor session={session} onLogout={()=>void logout()}/>:<><header className="topbar"><span className="brand">Прожито</span><span className="role">Редактор</span></header><Login onLogin={setSession}/></>):<p className="login">Проверяем редакторскую сессию…</p>}
  </div></>;
}
