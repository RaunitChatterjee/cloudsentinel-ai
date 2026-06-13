SEVERITY_SCORES = {
    "CRITICAL": 10,
    "HIGH": 7,
    "MEDIUM": 5,
    "LOW": 2
}

def get_risk_score(severity: str):
    return SEVERITY_SCORES.get(severity.upper(), 0)