from botocore.exceptions import ClientError

from app.services.aws_service import get_s3_client


def scan_s3_versioning():
    findings = []

    s3 = get_s3_client()

    buckets = s3.list_buckets().get("Buckets", [])
    

    for bucket in buckets:
        bucket_name = bucket["Name"]

        try:
            versioning = s3.get_bucket_versioning(
                Bucket=bucket_name
            )

            

            status = versioning.get("Status")

            

            if status != "Enabled":
                findings.append({
                    "severity": "MEDIUM",
                    "risk_score": 5,
                    "resource": bucket_name,
                    "finding": "S3 Versioning Disabled",
                    "description": (
                        "Bucket versioning is not enabled."
                    ),
                    "recommendation": (
                        "Enable S3 Versioning to protect against "
                        "accidental deletion and ransomware."
                    )
                })

        except ClientError:
            continue

    return findings