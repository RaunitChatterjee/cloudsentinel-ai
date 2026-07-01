from botocore.exceptions import ClientError

from app.services.aws_service import get_ec2_client


def scan_public_ec2_instances():
    findings = []

    ec2 = get_ec2_client()

    try:
        response = ec2.describe_instances()

        reservations = response.get("Reservations", [])

        for reservation in reservations:
            for instance in reservation.get("Instances", []):

                public_ip = instance.get("PublicIpAddress")

                if public_ip:
                    findings.append({
                        "severity": "MEDIUM",
                        "risk_score": 6,
                        "resource": instance["InstanceId"],
                        "finding": "EC2 Instance Has Public IP",
                        "description": (
                            f"EC2 instance has public IP address {public_ip}."
                        ),
                        "recommendation": (
                            "Move the instance into a private subnet or "
                            "restrict public access using a bastion host, "
                            "load balancer, or VPN."
                        )
                    })

    except ClientError:
        pass

    return findings