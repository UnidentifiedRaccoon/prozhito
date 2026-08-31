import unittest
from datetime import datetime, timezone
from index import plan


def utc(value):
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


class ScheduleTests(unittest.TestCase):
    def test_boundary(self):
        self.assertEqual(plan(utc("2026-08-31T20:59:59Z"), "STOPPED", True), "start")
        self.assertEqual(plan(utc("2026-08-31T21:00:00Z"), "RUNNING", True), "drain")
        self.assertEqual(plan(utc("2026-08-31T21:01:59Z"), "STOPPED", True), "drain")
        self.assertEqual(plan(utc("2026-08-31T21:02:00Z"), "RUNNING", True), "stop")
        self.assertEqual(plan(utc("2026-09-01T04:44:59Z"), "STOPPED", True), "stopped")
        self.assertEqual(plan(utc("2026-09-01T04:45:00Z"), "STOPPED", True), "start")
        self.assertEqual(plan(utc("2026-09-01T05:00:00Z"), "RUNNING", True), "running")

    def test_safety(self):
        for status in ("STARTING", "STOPPING", "UPDATING", "CREATING", "ERROR"):
            self.assertEqual(plan(utc("2026-08-31T22:00:00Z"), status, True), "wait_operation")
        self.assertEqual(plan(utc("2026-08-31T22:00:00Z"), "RUNNING", False), "backup_required")
        self.assertEqual(plan(utc("2026-08-31T22:00:00Z"), "STOPPED", True), "stopped")


if __name__ == "__main__":
    unittest.main()
