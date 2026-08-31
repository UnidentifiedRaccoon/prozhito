import {useState,type FormEvent} from "react";
import {api,message} from "./api";
export type Session={login:string;csrfToken:string};
export function Login({onLogin}:{onLogin:(session:Session)=>void}) {
  const [busy,setBusy]=useState(false);const [error,setError]=useState("");
  async function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();const form=event.currentTarget;const data=new FormData(form);setBusy(true);setError("");
    try {
      const session=await api<Session>("/api/admin/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({login:data.get("login"),password:data.get("password"),code:data.get("code")})});
      form.reset();onLogin(session);
    } catch(error) {setError(message(error));} finally {setBusy(false);}
  }
  return <main className="login"><h1>Вход для редактора</h1><p>Редактирование и публикация материалов «Прожито».</p><form onSubmit={submit}>
    <label>Логин<input name="login" autoComplete="username" required maxLength={64}/></label>
    <label>Пароль<input name="password" type="password" autoComplete="current-password" required maxLength={256}/></label>
    <label>Код из приложения-аутентификатора<input name="code" autoComplete="one-time-code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required/></label>
    {error?<p role="alert" className="error">{error}</p>:null}
    <button className="primary" disabled={busy}>{busy?"Входим…":"Войти"}</button>
  </form></main>;
}
