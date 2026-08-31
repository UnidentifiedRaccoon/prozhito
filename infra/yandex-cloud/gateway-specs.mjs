import {writeFileSync,mkdirSync} from "node:fs";
const service_account_id="ajekphqher89vtf5vjp8";
const container_id="bbaeht5qe8jsrhkf3ova";
const parameter=name=>({name,in:"path",required:true,schema:{type:"string"}});
const object=(bucket,key,parameters=[])=>({parameters,responses:{200:{description:"Static asset"}},"x-yc-apigateway-integration":{type:"object_storage",bucket,object:key,service_account_id}});
const backend=(path,parameters=[])=>({parameters,responses:{200:{description:"API response"}},"x-yc-apigateway-integration":{type:"serverless_containers",container_id,service_account_id,path}});
mkdirSync(".work/prozhito/gateways",{recursive:true});
for(const name of ["reader","editor"]) {
  const bucket=`prozhito-${name}-b1gr37s9`;
  const paths={
    "/":{get:object(bucket,name==="reader"?"cloud.html":"index.html")},
    "/assets/{file+}":{get:object(bucket,"assets/{file}",[parameter("file")])},
    "/media/{file+}":{get:object("prozhito-media-b1gr37s9","{file}",[parameter("file")])},
    "/api/status":{get:backend("/api/status")},
    "/robots.txt":{get:{responses:{200:{description:"Robots policy"}},"x-yc-apigateway-integration":{type:"dummy",http_code:200,http_headers:{"Content-Type":"text/plain"},content:{"text/plain":"User-agent: *\nDisallow: /\n"}}}},
  };
  if(name==="reader")paths["/api/v1/content"]={get:backend("/api/v1/content")};
  else {
    paths["/preview.html"]={get:object(bucket,"preview.html")};
    for(const path of ["session","content","publications","sections/{id}"])paths[`/api/admin/${path}`]={get:backend(`/api/admin/${path}`,path.includes("{id}")?[parameter("id")]:[])};
    for(const path of ["login","logout","rollback","sections/{id}/publish","sections/{id}/discard"])paths[`/api/admin/${path}`]={post:backend(`/api/admin/${path}`,path.includes("{id}")?[parameter("id")]:[])};
    paths["/api/admin/sections/{id}"].put=backend("/api/admin/sections/{id}",[parameter("id")]);
  }
  const spec={openapi:"3.0.0",info:{title:`Prozhito ${name}`,version:"1.0.0"},paths};
  writeFileSync(`.work/prozhito/gateways/${name}.json`,JSON.stringify(spec,null,2));
}
