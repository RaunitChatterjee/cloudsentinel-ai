def generate_ai_suggestions(finding):
    name = finding.get("finding", "").lower()

    suggestions = []

    if "port 22" in name:
        suggestions = [
            "Restrict SSH access to trusted IP addresses only.",
            "Consider using AWS Systems Manager Session Manager instead of SSH.",
            "Enable CloudTrail alerts for security group modifications.",
            "Review inbound rules and apply least privilege principles."
        ]

    elif "mfa" in name:
        suggestions = [
            "Enable MFA for all IAM users immediately.",
            "Require MFA through IAM policies.",
            "Review users with console access and enforce MFA enrollment.",
            "Enable AWS Config rules to detect users without MFA."
        ]

    elif "public bucket" in name:
        suggestions = [
            "Disable public access settings on the bucket.",
            "Review bucket policies and ACL permissions.",
            "Enable S3 Block Public Access.",
            "Enable access logging and monitor bucket changes."
        ]

    else:
        suggestions = [
            "Review the affected AWS resource.",
            "Apply least privilege principles.",
            "Enable monitoring and alerting.",
            "Document remediation steps and validate changes."
        ]

    return suggestions