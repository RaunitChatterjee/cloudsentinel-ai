import uuid
from datetime import datetime, timezone


def generate_scan_id():
    return str(uuid.uuid4())[:8]


def get_timestamp():
    return datetime.now(timezone.utc).isoformat()