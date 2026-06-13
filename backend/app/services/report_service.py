import uuid
from datetime import datetime


def generate_scan_id():
    return str(uuid.uuid4())[:8]


def get_timestamp():
    return datetime.utcnow().isoformat()