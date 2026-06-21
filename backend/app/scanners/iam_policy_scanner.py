from app.services.aws_service import get_iam_client


def scan_password_policy():
    iam = get_iam_client()
    findings = []

    try:
        policy = iam.get_account_password_policy()[
            "PasswordPolicy"
        ]

        issues = []

        if policy.get(
            "MinimumPasswordLength", 0
        ) < 14:
            issues.append(
                "minimum length below 14"
            )

        if not policy.get(
            "RequireSymbols", False
        ):
            issues.append(
                "symbols not required"
            )

        if not policy.get(
            "RequireNumbers", False
        ):
            issues.append(
                "numbers not required"
            )

        if not policy.get(
            "ExpirePasswords", False
        ):
            issues.append(
                "passwords never expire"
            )

        if issues:
            findings.append({
                "severity": "MEDIUM",
                "risk_score": 5,
                "resource":
                    "account-password-policy",
                "finding":
                    "Weak IAM Password Policy",
                "description":
                    f"Password policy issues: {', '.join(issues)}.",
                "recommendation":
                    "Require 14+ characters, symbols, numbers and password expiration."
            })

    except iam.exceptions.NoSuchEntityException:
        findings.append({
            "severity": "HIGH",
            "risk_score": 7,
            "resource":
                "account-password-policy",
            "finding":
                "No IAM Password Policy",
            "description":
                "No account password policy configured.",
            "recommendation":
                "Create an IAM password policy."
        })

    return findings