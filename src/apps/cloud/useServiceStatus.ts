import { useEffect, useState } from "react";
import { api,type ServiceStatus } from "./api";
export function useServiceStatus() {
  const [status,setStatus]=useState<ServiceStatus|null>(null);
  useEffect(()=>{
    let active=true;let timer:ReturnType<typeof setTimeout>;
    let request:AbortController|undefined;
    const check=async()=>{
      clearTimeout(timer);request?.abort();request=new AbortController();
      const controller=request;
      const timeout=setTimeout(()=>controller.abort(),10000);
      try {
        const next=await api<ServiceStatus>("/api/status",{signal:controller.signal});
        if(!active || controller.signal.aborted)return;
        setStatus(next);
        // Boundary timer uses server-relative duration, not the device wall clock.
        const boundary=Date.parse(next.mode==="open"?next.nextCloseAt:next.nextOpenAt)-Date.parse(next.serverTime);
        timer=setTimeout(()=>{if(boundary<=30000)setStatus(null);void check();},Math.max(500,Math.min(30000,boundary)));
      } catch {
        if(!active || (request!==controller))return;
        setStatus(null);timer=setTimeout(()=>void check(),15000);
      } finally {clearTimeout(timeout);}
    };
    const visible=()=>{if(document.visibilityState==="visible"){setStatus(null);void check();}};
    document.addEventListener("visibilitychange",visible);window.addEventListener("pageshow",visible);
    void check();
    return ()=>{active=false;clearTimeout(timer);request?.abort();document.removeEventListener("visibilitychange",visible);window.removeEventListener("pageshow",visible);};
  },[]);
  return status;
}
