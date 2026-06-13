from pydantic import BaseModel
from typing import List
from app.models.finding import Finding


class ScanResponse(BaseModel):
    scan_id: str
    timestamp: str
    total_findings: int

    critical: int
    high: int
    medium: int
    low: int

    findings: List[Finding]