import { makeApp } from "./app.ts";
import { makePool } from "./db.ts";
import { Repository } from "./repository.ts";
const pool = makePool();
const local=process.env.PROZHITO_LOCAL_TEST==="1";
const now=local&&process.env.PROZHITO_TEST_TIME?()=>new Date(process.env.PROZHITO_TEST_TIME!):undefined;
const app = await makeApp({repo:new Repository(pool),adminOrigin:process.env.ADMIN_ORIGIN??"",secondaryAdminOrigin:process.env.SECONDARY_ADMIN_ORIGIN,totpSecret:process.env.EDITOR_TOTP_SECRET??"",rateSecret:process.env.RATE_LIMIT_SECRET??"",local,now});
await app.listen({host:process.env.PROZHITO_LOCAL_TEST==="1"?"127.0.0.1":"0.0.0.0",port:Number(process.env.PORT??8080)});
for(const signal of ["SIGTERM","SIGINT"] as const) process.once(signal,async()=>{await app.close();await pool.end();process.exit(0);});
