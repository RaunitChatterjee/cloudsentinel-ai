from app.scanners.iam_scanner import scan_users_without_mfa
from app.scanners.s3_scanner import scan_public_buckets
from app.scanners.security_group_scanner import scan_open_security_groups
from app.scanners.iam_policy_scanner import scan_password_policy
from app.scanners.root_scanner import scan_root_account
from app.scanners.s3_encryption_scanner import scan_s3_encryption


def run_full_scan():
    findings = []

    findings.extend(
        scan_users_without_mfa()
    )

    findings.extend(
        scan_password_policy()
    )

    findings.extend(
        scan_root_account()
    )

    findings.extend(
        scan_public_buckets()
    )

    findings.extend(
        scan_s3_encryption()
    )

    findings.extend(
        scan_open_security_groups()
    )

    return findings