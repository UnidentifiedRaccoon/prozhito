// Run once; no payload is printed, passed through argv, or written to disk.
import {execFileSync} from "node:child_process";
import {randomBytes} from "node:crypto";
const folderId="b1gr37s9qf8nh0fuq1js";
const existing=JSON.parse(execFileSync("yc",["lockbox","secret","list","--folder-id",folderId,"--profile","default","--format","json"],{encoding:"utf8",stdio:["ignore","pipe","ignore"]}));
const names=["prozhito-editor-bootstrap","prozhito-editor-security"];
if(existing.some(s=>names.includes(s.name)))throw new Error("Secrets already exist: inspect metadata, do not rotate implicitly");
const token=execFileSync("yc",["iam","create-token","--profile","default"],{encoding:"utf8",stdio:["ignore","pipe","ignore"]}).trim();
const alphabet="ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const totp=Array.from(randomBytes(32),b=>alphabet[b&31]).join("");
for(const [name,entries] of [[names[0],{password:randomBytes(32).toString("base64url")}],[names[1],{totp,rateKey:randomBytes(48).toString("base64url")}]]) {
  const response=await fetch("https://lockbox.api.cloud.yandex.net/lockbox/v1/secrets",{method:"POST",headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json"},body:JSON.stringify({folderId,name,deletionProtection:true,versionPayloadEntries:Object.entries(entries).map(([key,textValue])=>({key,textValue}))})});
  const operation=await response.json();
  if(!response.ok||operation.error)throw new Error(`Secret creation failed: HTTP ${response.status}`);
  console.log(JSON.stringify({name,operationId:operation.id,id:operation.response?.id??operation.metadata?.secretId,versionId:operation.response?.currentVersion?.id}));
}
