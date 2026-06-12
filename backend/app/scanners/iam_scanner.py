from app.services.aws_service import get_iam_client

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
                "resource": username,
                "finding": "MFA Disabled"
            })

    return findings