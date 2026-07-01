from botocore.exceptions import ClientError

from app.services.aws_service import get_ec2_client


def scan_unused_security_groups():
    findings = []

    ec2 = get_ec2_client()

    try:
        security_groups = ec2.describe_security_groups()["SecurityGroups"]

        network_interfaces = ec2.describe_network_interfaces()["NetworkInterfaces"]

        used_security_groups = set()

        for eni in network_interfaces:
            for group in eni.get("Groups", []):
                used_security_groups.add(group["GroupId"])

        for sg in security_groups:
            group_id = sg["GroupId"]

            # Skip the default security group
            if sg["GroupName"] == "default":
                continue

            if group_id not in used_security_groups:
                findings.append({
                    "severity": "LOW",
                    "risk_score": 3,
                    "resource": group_id,
                    "finding": "Unused Security Group",
                    "description": (
                        "This security group is not attached to any network interface."
                    ),
                    "recommendation": (
                        "Review the security group and delete it if it is no longer required."
                    )
                })

    except ClientError:
        pass

    return findings