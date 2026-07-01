from app.services.aws_service import get_ec2_client
from app.services.risk_engine import get_risk_score


DANGEROUS_PORTS = {
    22: "SSH",
    3389: "RDP",
    3306: "MySQL",
    5432: "PostgreSQL",
    27017: "MongoDB",
    6379: "Redis",
}


def scan_open_security_groups():
    ec2 = get_ec2_client()

    findings = []

    groups = ec2.describe_security_groups()

    for sg in groups["SecurityGroups"]:

        group_name = sg["GroupName"]

        for permission in sg["IpPermissions"]:

            from_port = permission.get("FromPort")

            if from_port not in DANGEROUS_PORTS:
                continue

            service = DANGEROUS_PORTS[from_port]

            for ip_range in permission.get("IpRanges", []):

                cidr = ip_range.get("CidrIp")

                if cidr == "0.0.0.0/0":

                    findings.append(
                        {
                            "severity": "CRITICAL",
                            "risk_score": get_risk_score("CRITICAL"),
                            "resource": group_name,
                            "finding": f"{service} Port ({from_port}) Open to Internet",
                            "description": (
                                f"The security group allows {service} "
                                f"traffic on port {from_port} from anywhere "
                                "on the internet (0.0.0.0/0)."
                            ),
                            "recommendation": (
                                f"Restrict port {from_port} access to trusted "
                                "IP addresses or use a VPN/Bastion Host."
                            ),
                        }
                    )

    return findings