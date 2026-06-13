from app.services.aws_service import get_ec2_client
from app.services.risk_engine import get_risk_score


def scan_open_security_groups():

    ec2 = get_ec2_client()

    findings = []

    groups = ec2.describe_security_groups()

    dangerous_ports = [22, 3389, 3306]

    for sg in groups["SecurityGroups"]:

        group_name = sg["GroupName"]

        for permission in sg["IpPermissions"]:

            from_port = permission.get("FromPort")

            if from_port not in dangerous_ports:
                continue

            for ip_range in permission.get("IpRanges", []):

                cidr = ip_range.get("CidrIp")

                if cidr == "0.0.0.0/0":

                    findings.append({
                        "severity": "CRITICAL",
                        "risk_score": get_risk_score("CRITICAL"),
                        "resource": group_name,
                        "finding": f"Port {from_port} Open to Internet",
                        "description":
                            f"Security group allows port {from_port} from anywhere on the internet.",
                        "recommendation":
                            "Restrict access to trusted IP addresses."
                    })

    return findings