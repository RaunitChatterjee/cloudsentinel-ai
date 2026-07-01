from botocore.exceptions import ClientError

from app.services.aws_service import get_ec2_client


def scan_ebs_encryption():
    findings = []

    ec2 = get_ec2_client()

    try:
        response = ec2.describe_volumes()

        volumes = response.get("Volumes", [])

        for volume in volumes:
            if not volume.get("Encrypted", False):
                findings.append({
                    "severity": "HIGH",
                    "risk_score": 8,
                    "resource": volume["VolumeId"],
                    "finding": "Unencrypted EBS Volume",
                    "description": (
                        "This EBS volume is not encrypted."
                    ),
                    "recommendation": (
                        "Enable encryption for EBS volumes to protect "
                        "data at rest."
                    )
                })

    except ClientError:
        pass

    return findings