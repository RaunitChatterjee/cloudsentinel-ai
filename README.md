<div align="center">

# 🛡️ CloudSentinel AI

**An AI-powered cloud security scanner for AWS environments**

Scan your AWS resources, surface misconfigurations, get AI-generated remediation guidance, and export professional PDF security reports — all from one dashboard.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#-license)
![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=white)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi&logoColor=white)
![AWS](https://img.shields.io/badge/Cloud-AWS-FF9900?logo=amazonaws&logoColor=white)

</div>

---

## 📖 Overview

Misconfigurations remain one of the leading causes of cloud data breaches. **CloudSentinel AI** helps catch these issues before they become incidents by automatically scanning your AWS environment and presenting the results in a clear, actionable dashboard.

The application inspects key AWS services, assigns severity levels and risk scores to each finding, and uses AI to suggest practical remediation steps — so you know not just *what's* wrong, but *how* to fix it.

---

## ✨ Features

- 🔍 Automated scanning of AWS resources for common misconfigurations
- 🔑 Detects IAM users without Multi-Factor Authentication (MFA)
- 🔒 Detects missing or weak IAM password policies
- 🌐 Detects Security Groups exposing SSH (port 22) to the internet
- 🪣 Detects S3 buckets with versioning disabled
- 🤖 AI-generated remediation suggestions for every finding
- 📄 Professional PDF security report generation
- 📊 Interactive dashboard with charts and severity statistics
- 🔎 Search, filter, and sort findings in real time
- 🔐 API key authentication to secure backend access

---

## ⚙️ How It Works

1. The user starts a security scan from the dashboard.
2. The React frontend sends a request to the FastAPI backend.
3. The backend authenticates the request using an API key.
4. The scanner connects securely to AWS via the Boto3 SDK.
5. A set of security scanners analyzes AWS resources in parallel.
6. Findings are aggregated into a single security report.
7. AI generates remediation recommendations for each finding.
8. Results are rendered in the dashboard and can be exported as a PDF report.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React, Vite, Axios, Tailwind CSS, Chart.js |
| **Backend** | FastAPI, Python, Boto3 |
| **Cloud Services** | AWS IAM, AWS S3, AWS EC2 Security Groups |
| **Deployment** | Railway (backend), Vercel (frontend) |

---

## 📂 Project Structure

```text
cloudsentinel-ai/
├── backend/
│   ├── api/          # Route handlers
│   ├── core/          # Config, auth, shared utilities
│   ├── scanners/       # AWS misconfiguration scanners
│   ├── services/       # AI + report generation logic
│   └── main.py
│
├── frontend/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Dashboard, Findings, etc.
│   ├── services/        # API client layer
│   └── App.jsx
│
└── README.md
```

---

## 📸 Screenshots

<div align="center">

### Dashboard
<img width="2822" height="1632" alt="image" src="https://github.com/user-attachments/assets/28e99192-b1df-4f6a-adb1-32e0c9ba4dbf" />


### Findings Page
<img width="2822" height="1632" alt="image" src="https://github.com/user-attachments/assets/9839d523-fe78-4b98-ab32-23eaf226ecc1" />


### PDF Security Report
<img width="2822" height="1632" alt="image" src="https://github.com/user-attachments/assets/3dc2bed4-ad43-44d2-9991-071439406e2d" />
<img width="2822" height="1632" alt="image" src="https://github.com/user-attachments/assets/a0a3f9c0-42ea-4ecf-90f3-745518cd9179" />



</div>

---

## 🚀 Running the Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/cloudsentinel-ai.git
cd cloudsentinel-ai
```

### 2. Backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate      # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will typically run at `http://localhost:5173` and the backend at `http://localhost:8000`.

---

## 🔑 Environment Variables

Create a `.env` file inside the `backend/` folder with the following keys:

```env
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
CLOUDSENTINEL_API_KEY=
```

> ⚠️ **Never commit your AWS credentials or API keys to GitHub.** Add `.env` to your `.gitignore` before pushing any changes.

---

## 📌 Future Improvements

- [ ] Azure support
- [ ] Google Cloud support
- [ ] CloudTrail log analysis
- [ ] CIS Benchmark compliance checks
- [ ] Scheduled security scans
- [ ] Email notifications
- [ ] Terraform security scanning
- [ ] Kubernetes security scanning

---

## 👨‍💻 Author

**Raunit Chatterjee**
B.Tech CSE (Cyber Security) — Manipal University Jaipur

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
