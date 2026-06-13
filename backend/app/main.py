from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.aws import router as aws_router

app = FastAPI(title="CloudSentinel AI")

# Allow React frontend to access FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routes
app.include_router(aws_router, prefix="/api")


@app.get("/")
def root():
    return {"message": "CloudSentinel AI Running"}


@app.get("/health")
def health():
    return {"status": "healthy"}