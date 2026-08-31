// Moscow uses UTC+3. Compute from the server clock, never from request input.
export const MSK_OFFSET_MS = 3 * 60 * 60 * 1000;
export function schedule(now = new Date()) {
  const local = new Date(now.getTime() + MSK_OFFSET_MS);
  const minutes = local.getUTCHours() * 60 + local.getUTCMinutes();
  const localMidnight = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate());
  const open = minutes >= 480;
  return {
    timezone: "Europe/Moscow", serverTime: now.toISOString(),
    scheduledMaintenance: !open,
    editorWarning: minutes >= 1435,
    desiredDatabaseRunning: minutes >= 465,
    nextOpenAt: new Date(localMidnight - MSK_OFFSET_MS + (open ? 32 : 8) * 3600000).toISOString(),
    nextCloseAt: new Date(localMidnight - MSK_OFFSET_MS + 24 * 3600000).toISOString(),
  };
}
