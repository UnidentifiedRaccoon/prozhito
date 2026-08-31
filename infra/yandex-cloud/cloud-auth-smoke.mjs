// Credentials, TOTP and session exist only in this process and HTTPS requests.
// This check never saves or publishes content and never prints secret material.
import {execFileSync} from "node:child_process";
import {readFileSync} from "node:fs";
import assert from "node:assert/strict";
import {totpAt} from "../../server/auth.ts";
const config=JSON.parse(readFileSync(new URL("./pilot.json",import.meta.url),"utf8"));
if(process.argv[2]&&!['domain'].includes(process.argv[2]))throw new Error("Unknown smoke target");
const origin=process.argv[2]==='domain'?`https://${config.domains.editor}`:config.technicalOrigins.editor;
const token=execFileSync("yc",["iam","create-token","--profile","default"],{encoding:"utf8",stdio:["ignore","pipe","ignore"]}).trim();
async function secret(ref,key){
  const r=await fetch(`https://payload.lockbox.api.cloud.yandex.net/lockbox/v1/secrets/${ref.id}/payload?versionId=${ref.versionId}`,{headers:{Authorization:`Bearer ${token}`}});
  if(!r.ok)throw new Error("Secret unavailable");
  const payload=await r.json();const value=payload.entries.find(e=>e.key===key)?.textValue;
  if(!value)throw new Error("Secret entry unavailable");return value;
}
const [password,totp]=await Promise.all([secret(config.secrets.editorBootstrap,"password"),secret(config.secrets.editorSecurity,"totp")]);
const login=await fetch(origin+"/api/admin/login",{method:"POST",headers:{Origin:origin,"Content-Type":"application/json"},body:JSON.stringify({login:"editor",password,code:totpAt(totp,Math.floor(Date.now()/30000))})});
if(login.status!==200)throw new Error(`Editor login failed: HTTP ${login.status}`);
const session=await login.json();const cookie=login.headers.get("set-cookie");
assert.ok(cookie?.includes("Secure")&&cookie.includes("HttpOnly")&&cookie.includes("SameSite=Strict"));
const headers={Cookie:cookie.split(";")[0]};
const draft=await fetch(origin+"/api/admin/sections/L01-S01",{headers});assert.equal(draft.status,200);
const document=(await draft.json()).document;assert.equal(document.id,"L01-S01");
const rejected=await fetch(origin+"/api/admin/logout",{method:"POST",headers:{...headers,Origin:origin,"Content-Type":"application/json"},body:"{}"});assert.equal(rejected.status,403);
const logout=await fetch(origin+"/api/admin/logout",{method:"POST",headers:{...headers,Origin:origin,"Content-Type":"application/json","X-CSRF-Token":session.csrfToken},body:"{}"});assert.equal(logout.status,200);
assert.equal((await fetch(origin+"/api/admin/session",{headers})).status,401);
console.log("PASS: HTTPS editor login, MFA, Secure/HttpOnly/SameSite cookie, draft read, CSRF rejection, logout revocation. No content changed.");
