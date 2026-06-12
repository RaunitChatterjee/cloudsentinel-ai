from fastapi import APIRouter
from app.services.aws_service import get_iam_client
from app.scanners.iam_scanner import scan_users_without_mfa

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