import {execFileSync} from "node:child_process";
import {readFileSync} from "node:fs";
const config=JSON.parse(readFileSync(new URL("./pilot.json",import.meta.url),"utf8"));
const image=process.argv[2];
if(!image?.startsWith(`cr.yandex/${config.registryId}/prozhito-api@sha256:`))throw new Error("Pass an immutable image digest from this project's registry");
const secret=(variable,ref,key=ref.key)=>["--secret",`environment-variable=${variable},id=${ref.id},version-id=${ref.versionId},key=${key}`];
const s=config.secrets;
const args=["serverless","container","revision","deploy","--container-id",config.containers.api,"--image",image,
  "--service-account-id",config.serviceAccounts.runtime,"--network-id",config.networkId,"--memory","512MB","--cores","1","--core-fraction","100","--concurrency","8","--execution-timeout","30s","--min-instances","0","--zone-instances-limit","2",
  "--metadata-options","gce-http-endpoint=disabled,aws-v1-http-endpoint=disabled",
  "--environment",`PGHOST=${config.database.host},PGUSER=prozhito_app,PGDATABASE=prozhito,ADMIN_ORIGIN=${config.technicalOrigins.editor},SECONDARY_ADMIN_ORIGIN=https://${config.domains.editor}`,
  ...secret("PGPASSWORD",s.runtimeDatabase),...secret("EDITOR_TOTP_SECRET",s.editorSecurity,"totp"),...secret("RATE_LIMIT_SECRET",s.editorSecurity,"rateKey"),"--profile","default","--format","json"];
const result=JSON.parse(execFileSync("yc",args,{encoding:"utf8",stdio:["ignore","pipe","inherit"]}));
console.log(JSON.stringify({id:result.id,status:result.status,image}));
