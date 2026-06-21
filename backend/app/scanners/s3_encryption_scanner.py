from app.services.aws_service import get_s3_client


def scan_s3_encryption():
    s3 = get_s3_client()
    findings = []

    buckets = s3.list_buckets()[
        "Buckets"
    ]

    for bucket in buckets:
        name = bucket["Name"]

        try:
            s3.get_bucket_encryption(
                Bucket=name
            )

        except Exception:
            findings.append({
                "severity": "MEDIUM",
                "risk_score": 5,
                "resource": name,
                "finding":
                    "S3 Bucket Not Encrypted",
                "description":
                    f"Bucket '{name}' has no default encryption.",
                "recommendation":
                    "Enable SSE-S3 or SSE-KMS encryption."
            })

    return findings