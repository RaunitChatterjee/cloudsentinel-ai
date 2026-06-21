import boto3
import os
from dotenv import load_dotenv

load_dotenv()


def get_iam_client():
    return boto3.client(
        "iam",
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
        region_name=os.getenv("AWS_REGION")
    )


def get_ec2_client():
    return boto3.client(
        "ec2",
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
        region_name=os.getenv("AWS_REGION")
    )
def get_s3_client():
    import boto3
    import os
    from dotenv import load_dotenv

    load_dotenv()

    return boto3.client(
        "s3",
        aws_access_key_id=os.getenv(
            "AWS_ACCESS_KEY_ID"
        ),
        aws_secret_access_key=os.getenv(
            "AWS_SECRET_ACCESS_KEY"
        ),
        region_name=os.getenv(
            "AWS_REGION"
        )
    )