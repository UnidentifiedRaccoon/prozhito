"""Private, idempotent controller. Only this pilot cluster; no event-selected targets."""
import json
import logging
from datetime import datetime, timezone, timedelta
from urllib.request import Request, urlopen
from urllib.error import HTTPError

CLUSTER_ID = "c9qgfensmmafe5c70nhm"
FOLDER_ID = "b1gr37s9qf8nh0fuq1js"
API = "https://mdb.api.cloud.yandex.net/managed-postgresql/v1"
LOG = logging.getLogger(__name__)


def plan(now, status, has_backup):
    local = now.astimezone(timezone(timedelta(hours=3)))
    minute = local.hour * 60 + local.minute
    if minute < 2:
        return "drain"
    if status not in ("RUNNING", "STOPPED"):
        return "wait_operation"
    if minute >= 465:
        return "start" if status == "STOPPED" else "running"
    if status == "STOPPED":
        return "stopped"
    return "stop" if has_backup else "backup_required"


def request_json(url, token=None, method="GET"):
    headers = {"Metadata-Flavor": "Google"} if token is None else {"Authorization": "Bearer " + token}
    data = None
    if method == "POST":
        data = b"{}"
        headers["Content-Type"] = "application/json"
    with urlopen(Request(url, headers=headers, method=method, data=data), timeout=15) as response:
        return json.load(response)


def handler(event, context):
    # Event timestamps and contents are intentionally ignored (late/duplicate delivery).
    try:
        token = request_json("http://169.254.169.254/computeMetadata/v1/instance/service-accounts/default/token")["access_token"]
        cluster = request_json(API + "/clusters/" + CLUSTER_ID, token)
        if cluster.get("id") != CLUSTER_ID or cluster.get("folderId") != FOLDER_ID:
            raise RuntimeError("cluster_scope_mismatch")
        status = cluster.get("status", "UNKNOWN")
        now = datetime.now(timezone.utc)
        has_backup = False
        preliminary = plan(now, status, False)
        if preliminary == "backup_required":
            backups = request_json(API + "/clusters/" + CLUSTER_ID + "/backups?pageSize=1", token)
            has_backup = bool(backups.get("backups"))
        action = plan(now, status, has_backup)
        if action in ("start", "stop"):
            operation = request_json(API + "/clusters/" + CLUSTER_ID + ":" + action, token, "POST")
            LOG.warning(json.dumps({"event": "db_schedule_operation", "action": action, "operationId": operation.get("id")}))
        elif action == "backup_required":
            # Do not force stop or spawn recurring backups. Initial backup is a deploy gate.
            LOG.error("db_schedule_initial_backup_missing")
        return {"statusCode": 200, "body": json.dumps({"action": action, "status": status})}
    except HTTPError as error:
        # A concurrent controller call or maintenance may win; next timer reconciles.
        LOG.error(json.dumps({"event": "db_schedule_api_error", "httpStatus": error.code}))
        raise RuntimeError("db_schedule_api_error") from None
    except Exception:
        LOG.error("db_schedule_failed")
        raise RuntimeError("db_schedule_failed") from None
