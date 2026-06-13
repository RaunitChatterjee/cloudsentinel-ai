from app.scanners.iam_scanner import scan_users_without_mfa
from app.scanners.s3_scanner import scan_public_buckets
from app.scanners.security_group_scanner import scan_open_security_groups


def run_full_scan():

    findings = []

    findings.extend(scan_users_without_mfa())
    findings.extend(scan_public_buckets())
    findings.extend(scan_open_security_groups())

    return findings