from app.services.aws_service import get_iam_client
from app.services.risk_engine import get_risk_score


def scan_users_without_mfa():
    iam = get_iam_client()

    findings = []

    users = iam.list_users()["Users"]

    for user in users:
        username = user["UserName"]

        mfa_devices = iam.list_mfa_devices(
            UserName=username
        )["MFADevices"]

        if len(mfa_devices) == 0:
            findings.append({
                "severity": "HIGH",
                "risk_score": get_risk_score("HIGH"),
                "resource": username,
                "finding": "MFA Disabled",
                "description":
                    "IAM user does not have multi-factor authentication enabled.",
                "recommendation":
                    "Enable MFA for this IAM user."
            })

    return findings