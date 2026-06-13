from fastapi import APIRouter
from app.services.aws_service import get_iam_client
from app.scanners.iam_scanner import scan_users_without_mfa
from app.scanners.s3_scanner import scan_public_buckets
from app.scanners.master_scanner import run_full_scan
router = APIRouter()

@router.get("/aws-test")
def aws_test():

    iam = get_iam_client()

    users = iam.list_users()

    return {
        "connected": True,
        "iam_users": len(users["Users"])
    }

@router.get("/iam/mfa-check")
def mfa_check():

    findings = scan_users_without_mfa()

    return findings
@router.get("/s3/public-check")
def s3_public_check():

    findings = scan_public_buckets()

    return findings
@router.get("/scan")
def full_scan():

    findings = run_full_scan()

    return {
        "total_findings": len(findings),
        "findings": findings
    }

def get_ec2_client():
    import boto3
    import os
    from dotenv import load_dotenv

    load_dotenv()

    return boto3.client(
        "ec2",
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
        region_name=os.getenv("AWS_REGION")
    )