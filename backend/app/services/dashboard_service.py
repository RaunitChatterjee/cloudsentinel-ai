def calculate_dashboard(findings):

    critical = 0
    high = 0
    medium = 0
    low = 0
    risk_score = 0

    for finding in findings:

        severity = finding["severity"]

        if severity == "CRITICAL":
            critical += 1
        elif severity == "HIGH":
            high += 1
        elif severity == "MEDIUM":
            medium += 1
        elif severity == "LOW":
            low += 1

        risk_score += finding["risk_score"]

    if risk_score >= 15:
        status = "AT RISK"
    elif risk_score >= 7:
        status = "WARNING"
    else:
        status = "HEALTHY"

    return {
        "total_findings": len(findings),
        "critical": critical,
        "high": high,
        "medium": medium,
        "low": low,
        "risk_score": risk_score,
        "status": status
    }