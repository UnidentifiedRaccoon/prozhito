import test from "node:test";
import assert from "node:assert/strict";
import { schedule } from "../schedule.ts";
import { totpAt,verifyTotp,hashPassword,verifyPassword } from "../auth.ts";

test("Moscow availability boundaries do not use host timezone",()=>{
  for(const [instant,closed] of [["2026-08-31T20:59:59Z",false],["2026-08-31T21:00:00Z",true],["2026-09-01T04:45:00Z",true],["2026-09-01T04:59:59Z",true],["2026-09-01T05:00:00Z",false]] as const) assert.equal(schedule(new Date(instant)).scheduledMaintenance,closed);
  assert.equal(schedule(new Date("2026-08-31T21:00:00Z")).nextOpenAt,"2026-09-01T05:00:00.000Z");
  assert.equal(schedule(new Date("2026-08-31T20:55:00Z")).editorWarning,true);
});
test("MFA matches the RFC 6238 SHA1 vector (six digit truncation)",()=>{
  const secret="GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ";
  assert.equal(totpAt(secret,1),"287082");
  assert.equal(verifyTotp(secret,"287082",new Date(59000)),1);
  assert.equal(verifyTotp(secret,"invalid",new Date(59000)),null);
});
test("Password hashing uses independent random salts",async()=>{
  const hash=await hashPassword("synthetic-password-for-unit-test");
  assert.equal(await verifyPassword("synthetic-password-for-unit-test",hash),true);
  assert.equal(await verifyPassword("incorrect",hash),false);
  assert.equal(await verifyPassword("anything","invalid"),false);
});
