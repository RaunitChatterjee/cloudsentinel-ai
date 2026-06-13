from app.services.risk_engine import get_risk_score
import boto3
import os
from dotenv import load_dotenv

load_dotenv()

s3 = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_REGION")
)


def scan_public_buckets():
    findings = []

    buckets = s3.list_buckets()["Buckets"]

    for bucket in buckets:
        bucket_name = bucket["Name"]

        try:
            status = s3.get_public_access_block(
                Bucket=bucket_name
            )

            public_block = status["PublicAccessBlockConfiguration"]

            if not all(public_block.values()):
                findings.append({
                    "severity": "CRITICAL",
                    "risk_score": get_risk_score("CRITICAL"),
                    "resource": bucket_name,
                    "finding": "Public S3 Bucket",
                    "description":
                        "Bucket does not fully block public access.",
                    "recommendation":
                        "Enable Block Public Access for this bucket."
                })

        except Exception:
            findings.append({
                "severity": "CRITICAL",
                "risk_score": get_risk_score("CRITICAL"),
                "resource": bucket_name,
                "finding": "Public Access Configuration Unknown",
                "description":
                    "Bucket has no Public Access Block configuration.",
                "recommendation":
                    "Review and enable Block Public Access."
            })

    return findings