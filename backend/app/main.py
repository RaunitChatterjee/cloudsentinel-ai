from fastapi import FastAPI
from app.api.aws import router as aws_router

app = FastAPI(title="CloudSentinel AI")

app.include_router(aws_router, prefix="/api")

@app.get("/")
def root():
    return {"message": "CloudSentinel AI Running"}

@app.get("/health")
def health():
    return {"status": "healthy"}