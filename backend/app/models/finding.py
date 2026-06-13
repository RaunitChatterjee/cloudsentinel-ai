from pydantic import BaseModel


class Finding(BaseModel):
    severity: str
    risk_score: int
    resource: str
    finding: str
    description: str
    recommendation: str