from app.scanners.iam_scanner import scan_users_without_mfa
from app.scanners.iam_policy_scanner import scan_password_policy
from app.scanners.root_scanner import scan_root_account

from app.scanners.s3_scanner import scan_public_buckets
from app.scanners.s3_encryption_scanner import scan_s3_encryption
from app.scanners.s3_versioning_scanner import scan_s3_versioning

from app.scanners.ebs_encryption_scanner import scan_ebs_encryption
from app.scanners.ec2_public_ip_scanner import scan_public_ec2_instances

from app.scanners.security_group_scanner import scan_open_security_groups
from app.scanners.unused_security_group_scanner import (
    scan_unused_security_groups,
)


def run_full_scan():
    findings = []

    # IAM
    findings.extend(scan_users_without_mfa())
    findings.extend(scan_password_policy())
    findings.extend(scan_root_account())

    # S3
    findings.extend(scan_public_buckets())
    findings.extend(scan_s3_encryption())
    findings.extend(scan_s3_versioning())

    # EC2 / EBS
    findings.extend(scan_ebs_encryption())
    findings.extend(scan_public_ec2_instances())

    # Security Groups
    findings.extend(scan_open_security_groups())
    findings.extend(scan_unused_security_groups())

    return findings