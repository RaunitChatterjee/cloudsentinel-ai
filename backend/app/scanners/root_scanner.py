from app.services.aws_service import get_iam_client


def scan_root_account():
    iam = get_iam_client()
    findings = []

    summary = iam.get_account_summary()[
        "SummaryMap"
    ]

    if (
        summary.get(
            "AccountAccessKeysPresent", 0
        ) > 0
    ):
        findings.append({
            "severity": "CRITICAL",
            "risk_score": 10,
            "resource":
                "root-account",
            "finding":
                "Root Account Has Access Keys",
            "description":
                "AWS root account has active access keys.",
            "recommendation":
                "Delete root access keys immediately."
        })

    if (
        summary.get(
            "AccountMFAEnabled", 0
        ) == 0
    ):
        findings.append({
            "severity": "CRITICAL",
            "risk_score": 10,
            "resource":
                "root-account",
            "finding":
                "Root Account MFA Disabled",
            "description":
                "Root account does not have MFA enabled.",
            "recommendation":
                "Enable MFA on the root account."
        })

    return findings