import {useEffect,useRef,useState} from "react";
export type Confirmation={title:string;description:string;reasonRequired?:boolean;run:(reason:string)=>void};
export function ConfirmAction({value,onClose}:{value:Confirmation;onClose:()=>void}) {
  const dialog=useRef<HTMLDialogElement>(null);const [reason,setReason]=useState("");
  useEffect(()=>{dialog.current?.showModal();return()=>dialog.current?.close();},[]);
  return <dialog ref={dialog} aria-labelledby="confirmation-title" onCancel={onClose} className="confirmation"><form onSubmit={event=>{event.preventDefault();if(value.reasonRequired&&reason.trim().length<3)return;onClose();value.run(reason.trim());}}>
    <h2 id="confirmation-title">{value.title}</h2><p>{value.description}</p>
    {value.reasonRequired?<><label>Основание изменения<textarea required minLength={3} maxLength={1000} value={reason} onChange={e=>setReason(e.target.value)} rows={3}/></label><label className="review-check"><input type="checkbox" required/> Содержание проверено редактором</label></>:null}
    <div className="actions"><button type="button" autoFocus onClick={onClose}>Отмена</button><button className="primary" type="submit">Подтвердить</button></div>
  </form></dialog>;
}
