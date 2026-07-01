def generate_ai_suggestions(finding):
    name = finding.get("finding", "").lower()

    # -----------------------------
    # Security Groups - SSH
    # -----------------------------
    if "port 22" in name or "ssh" in name:
        return [
            "Restrict SSH (port 22) access to trusted IP addresses only.",
            "Replace direct SSH access with AWS Systems Manager Session Manager whenever possible.",
            "Enable CloudTrail alerts for Security Group modifications.",
            "Review inbound security group rules and remove 0.0.0.0/0 where unnecessary."
        ]

    # -----------------------------
    # Security Groups - RDP
    # -----------------------------
    elif "3389" in name or "rdp" in name:
        return [
            "Restrict RDP access to trusted administrator IP addresses.",
            "Avoid exposing Windows servers directly to the internet.",
            "Use a VPN or Bastion Host for remote administration.",
            "Enable CloudWatch monitoring for unusual RDP activity."
        ]

    # -----------------------------
    # MySQL
    # -----------------------------
    elif "3306" in name or "mysql" in name:
        return [
            "Restrict MySQL access to application servers only.",
            "Never expose database ports directly to the public internet.",
            "Enable encryption in transit using TLS.",
            "Review database security groups regularly."
        ]

    # -----------------------------
    # PostgreSQL
    # -----------------------------
    elif "5432" in name or "postgres" in name:
        return [
            "Allow PostgreSQL access only from trusted application instances.",
            "Enable SSL/TLS connections.",
            "Audit database authentication logs regularly.",
            "Restrict inbound rules using least privilege."
        ]

    # -----------------------------
    # MongoDB
    # -----------------------------
    elif "27017" in name or "mongodb" in name:
        return [
            "Disable public MongoDB access immediately.",
            "Enable MongoDB authentication and role-based access.",
            "Whitelist trusted IP addresses only.",
            "Enable database auditing and monitoring."
        ]

    # -----------------------------
    # Redis
    # -----------------------------
    elif "6379" in name or "redis" in name:
        return [
            "Never expose Redis directly to the internet.",
            "Require authentication and enable encryption.",
            "Restrict Redis access to internal networks only.",
            "Monitor Redis connections using CloudWatch."
        ]

    # -----------------------------
    # IAM MFA
    # -----------------------------
    elif "mfa" in name:
        return [
            "Enable MFA for all IAM users immediately.",
            "Require MFA through IAM policies.",
            "Review users with console access and enforce MFA enrollment.",
            "Enable AWS Config rules to detect users without MFA."
        ]

    # -----------------------------
    # Password Policy
    # -----------------------------
    elif "password policy" in name:
        return [
            "Create an IAM password policy requiring at least 14 characters.",
            "Require uppercase, lowercase, numbers, and symbols.",
            "Enable password expiration and prevent password reuse.",
            "Review IAM users and enforce password updates."
        ]

    # -----------------------------
    # Root Account
    # -----------------------------
    elif "root" in name:
        return [
            "Enable MFA on the AWS root account immediately.",
            "Remove any active root access keys.",
            "Avoid using the root account for daily administration.",
            "Store root credentials securely and monitor root activity."
        ]

    # -----------------------------
    # S3 Public Bucket
    # -----------------------------
    elif "public bucket" in name:
        return [
            "Disable public access settings on the bucket.",
            "Review bucket policies and ACL permissions.",
            "Enable S3 Block Public Access.",
            "Enable S3 access logging and monitor bucket activity."
        ]

    # -----------------------------
    # S3 Encryption
    # -----------------------------
    elif "s3 encryption" in name or "bucket encryption" in name:
        return [
            "Enable default bucket encryption using SSE-S3 or SSE-KMS.",
            "Use customer-managed AWS KMS keys for sensitive workloads.",
            "Verify all existing objects are encrypted.",
            "Monitor bucket encryption compliance using AWS Config."
        ]

    # -----------------------------
    # S3 Versioning
    # -----------------------------
    elif "versioning" in name:
        return [
            "Enable S3 Versioning to recover from accidental deletion and ransomware incidents.",
            "Enable versioning using the AWS Console or the AWS CLI (put-bucket-versioning).",
            "Review lifecycle policies after enabling versioning to optimize storage costs.",
            "Use AWS Config to continuously monitor bucket versioning compliance."
        ]

    # -----------------------------
    # EBS Encryption
    # -----------------------------
    elif "ebs" in name or "volume" in name:
        return [
            "Create an encrypted snapshot of the existing EBS volume.",
            "Create a new encrypted EBS volume from the snapshot.",
            "Replace the unencrypted volume after validating application functionality.",
            "Enable EBS encryption by default for the AWS Region."
        ]

    # -----------------------------
    # EC2 Public IP
    # -----------------------------
    elif "public ip" in name:
        return [
            "Move the EC2 instance into a private subnet whenever possible.",
            "Use an Application Load Balancer or Bastion Host instead of exposing the instance directly.",
            "Restrict inbound traffic using Security Groups and Network ACLs.",
            "Continuously monitor internet-facing instances using AWS Config and Security Hub."
        ]

    # -----------------------------
    # Unused Security Group
    # -----------------------------
    elif "unused security group" in name:
        return [
            "Verify that the security group is no longer attached to any AWS resource.",
            "Delete unused security groups to reduce attack surface and simplify management.",
            "Review security group inventory regularly for stale configurations.",
            "Use AWS Config to detect unused security groups automatically."
        ]

    # -----------------------------
    # Default
    # -----------------------------
    else:
        return [
            "Review the AWS resource configuration and identify the root cause of the finding.",
            "Apply the recommended remediation following AWS Well-Architected Security best practices.",
            "Enable AWS Config, CloudTrail, and CloudWatch monitoring for continuous compliance.",
            "Re-run the CloudSentinel AI scan after remediation to verify the issue has been resolved."
        ]