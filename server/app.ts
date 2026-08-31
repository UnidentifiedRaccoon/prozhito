import Fastify, { type FastifyRequest } from "fastify";
import cookie from "@fastify/cookie";
import { z } from "zod";
import { schedule } from "./schedule.ts";
import { ApiError, Repository } from "./repository.ts";
import { csrfToken, digest, hashPassword, newToken, safeEqual, verifyPassword, verifyTotp } from "./auth.ts";
import { documentSchema, SECTION_IDS } from "./content.ts";

type Options = {repo:Repository;adminOrigin:string;secondaryAdminOrigin?:string;totpSecret:string;rateSecret:string;local?:boolean;now?:()=>Date};
export async function makeApp({repo,adminOrigin,secondaryAdminOrigin,totpSecret,rateSecret,local=false,now=()=>new Date()}:Options) {
  if (!local && (!adminOrigin.startsWith("https://") || rateSecret.length<32 || totpSecret.length<32)) throw new Error("Security configuration is incomplete");
  const adminOrigins=[adminOrigin,...(secondaryAdminOrigin?[secondaryAdminOrigin]:[])];
  if(!local&&adminOrigins.some(origin=>new URL(origin).origin!==origin||!origin.startsWith("https://")))throw new Error("Invalid admin origin");
  const app = Fastify({logger:false,bodyLimit:512*1024,requestTimeout:15000,trustProxy:false});
  await app.register(cookie);
  const cookieName = local ? "prozhito_editor_local" : "__Host-prozhito_editor";
  const cookieOptions = {path:"/",httpOnly:true,secure:!local,sameSite:"strict" as const};
  const fakePassword = await hashPassword(newToken());
  app.addHook("onRequest",async(request,reply)=>{
    reply.header("Cache-Control","no-store").header("X-Content-Type-Options","nosniff");
    const url = request.url.split("?")[0];
    if(url.startsWith("/api/admin/")) {
      const sameHostOrigin=adminOrigins.find(origin=>new URL(origin).host===request.headers.host);
      if (!sameHostOrigin) throw new ApiError(403,"admin_origin_required");
      if (!["GET","HEAD"].includes(request.method) && (request.headers.origin !== sameHostOrigin || !String(request.headers["content-type"]??"").startsWith("application/json"))) throw new ApiError(403,"origin_rejected");
    }
    if (url.startsWith("/api/") && url !== "/api/status" && schedule(now()).scheduledMaintenance) {
      const state = schedule(now());
      reply.header("Retry-After",String(Math.max(1,Math.ceil((Date.parse(state.nextOpenAt)-now().getTime())/1000))));
      return reply.code(503).send({code:"scheduled_maintenance",...state});
    }
  });
  app.setErrorHandler((error,request,reply)=>{
    if(error instanceof z.ZodError) return reply.code(400).send({code:"invalid_input",issues:error.issues.map(i=>({path:i.path,message:i.message}))});
    if(error instanceof ApiError) return reply.code(error.statusCode).send({code:error.code});
    if (error instanceof Error && "statusCode" in error && typeof error.statusCode === "number" && error.statusCode < 500) return reply.code(error.statusCode).send({code:"invalid_request"});
    // Never log request bodies, credentials, SQL errors, headers or sessions.
    console.error(JSON.stringify({event:"request_failed",requestId:request.id}));
    return reply.code(503).header("Retry-After","30").send({code:"temporarily_unavailable"});
  });
  app.get("/health/live",async()=>({ok:true}));
  app.get("/health/ready",async(_,reply)=>{
    const ready = await repo.ready().catch(()=>false);
    return reply.code(ready?200:503).send({ready});
  });
  app.get("/api/status",async(_,reply)=>{
    const state = schedule(now());
    const ready = !state.scheduledMaintenance && await repo.ready().catch(()=>false);
    return reply.code(200).send({...state,ready,mode:state.scheduledMaintenance?"scheduled_maintenance":ready?"open":"temporarily_unavailable"});
  });
  app.get("/api/v1/content",async()=>repo.published());
  async function editor(request:FastifyRequest,write=false) {
    const token = request.cookies[cookieName] ?? "";
    if (!/^[A-Za-z0-9_-]{43}$/.test(token)) throw new ApiError(401,"authentication_required");
    const row = (await repo.pool.query(`SELECT e.id,e.login FROM prozhito.editor_sessions s JOIN prozhito.editors e ON e.id=s.editor_id
      WHERE s.token_hash=$1 AND s.expires_at>$2 AND e.enabled`,[digest(token),now()])).rows[0];
    if(!row) throw new ApiError(401,"authentication_required");
    if(write && !safeEqual(String(request.headers["x-csrf-token"]??""),csrfToken(token))) throw new ApiError(403,"csrf_rejected");
    return {id:row.id as string,login:row.login as string,csrfToken:csrfToken(token)};
  }
  app.post("/api/admin/login",async(request,reply)=>{
    const input = z.object({login:z.string().min(3).max(64),password:z.string().min(1).max(256),code:z.string().regex(/^\d{6}$/)}).strict().parse(request.body);
    // Shared PostgreSQL counters, including a global bucket against forged forwarding headers.
    const forwarded=String(request.headers["x-forwarded-for"]??request.ip).split(",").at(-1)!.trim();
    for(const [key,limit] of [["global",60],[`login:${input.login}`,8],[`ip:${forwarded}`,20]] as const){
      const count=(await repo.pool.query(`INSERT INTO prozhito.login_attempts(key_hash,attempts,reset_at) VALUES($1,1,$2)
        ON CONFLICT(key_hash) DO UPDATE SET attempts=CASE WHEN prozhito.login_attempts.reset_at<=$3 THEN 1 ELSE prozhito.login_attempts.attempts+1 END,
        reset_at=CASE WHEN prozhito.login_attempts.reset_at<=$3 THEN $2 ELSE prozhito.login_attempts.reset_at END RETURNING attempts`,
        [digest(rateSecret+key),new Date(now().getTime()+15*60000),now()])).rows[0].attempts;
      if(count>limit) throw new ApiError(429,"login_rate_limited");
    }
    const row=(await repo.pool.query("SELECT id,password_hash,last_totp_step FROM prozhito.editors WHERE login=$1 AND enabled",[input.login])).rows[0];
    const valid=await verifyPassword(input.password,row?.password_hash??fakePassword);
    const step=verifyTotp(totpSecret,input.code,now());
    if(!row || !valid || step===null) throw new ApiError(401,"invalid_credentials");
    const accepted=await repo.pool.query("UPDATE prozhito.editors SET last_totp_step=$2 WHERE id=$1 AND last_totp_step<$2 RETURNING id",[row.id,step]);
    if(!accepted.rowCount) throw new ApiError(401,"invalid_credentials");
    const token=newToken();
    await repo.pool.query("INSERT INTO prozhito.editor_sessions(token_hash,editor_id,expires_at) VALUES($1,$2,$3)",[digest(token),row.id,new Date(now().getTime()+8*3600000)]);
    await repo.pool.query("DELETE FROM prozhito.editor_sessions WHERE expires_at<=$1",[now()]);
    await repo.pool.query("DELETE FROM prozhito.login_attempts WHERE reset_at<=$1",[now()]);
    reply.setCookie(cookieName,token,{...cookieOptions,maxAge:8*3600});
    return {login:input.login,csrfToken:csrfToken(token)};
  });
  app.get("/api/admin/session",async(request)=>editor(request));
  app.post("/api/admin/logout",async(request,reply)=>{
    await editor(request,true);
    await repo.pool.query("DELETE FROM prozhito.editor_sessions WHERE token_hash=$1",[digest(request.cookies[cookieName]!)]);
    reply.clearCookie(cookieName,cookieOptions); return {ok:true};
  });
  app.get("/api/admin/content",async(request)=>{await editor(request);return repo.published();});
  app.get("/api/admin/sections/:id",async(request)=>{
    await editor(request);const {id}=z.object({id:z.enum(SECTION_IDS as [string,...string[]])}).parse(request.params);return repo.draft(id);
  });
  app.put("/api/admin/sections/:id",async(request)=>{
    const user=await editor(request,true);const {id}=z.object({id:z.string()}).parse(request.params);
    const body=z.object({version:z.number().int().nonnegative(),baseRevisionId:z.uuid(),document:documentSchema}).strict().parse(request.body);
    return repo.save(id,user.id,body);
  });
  app.post("/api/admin/sections/:id/publish",async(request)=>{
    const user=await editor(request,true);const {id}=z.object({id:z.string()}).parse(request.params);
    const body=z.object({version:z.number().int().positive(),reason:z.string().trim().min(3).max(1000)}).strict().parse(request.body);
    return repo.publish(id,user.id,body.version,body.reason);
  });
  app.get("/api/admin/publications",async(request)=>{await editor(request);return repo.history();});
  app.post("/api/admin/sections/:id/discard",async(request)=>{
    const user=await editor(request,true);const {id}=z.object({id:z.enum(SECTION_IDS as [string,...string[]])}).parse(request.params);
    const {version}=z.object({version:z.number().int().positive()}).strict().parse(request.body);
    return repo.discard(id,user.id,version);
  });
  app.post("/api/admin/rollback",async(request)=>{
    const user=await editor(request,true);const body=z.object({target:z.uuid(),expectedCurrent:z.uuid(),reason:z.string().trim().min(3).max(1000)}).strict().parse(request.body);
    return repo.rollback(body.target,body.expectedCurrent,user.id,body.reason);
  });
  return app;
}
