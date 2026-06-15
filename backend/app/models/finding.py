from pydantic import BaseModel
from typing import List


class Finding(BaseModel):
    severity: str
    risk_score: int
    resource: str
    finding: str
    description: str
    recommendation: str
    ai_suggestions: List[str] = []