# 🧠 HireMind — AI Mock Interview & Code Evaluation Simulator

HireMind is a full-stack AI-powered mock technical and behavioral interview platform. It features custom company personas (Google, Amazon, Microsoft, Meta), a live code editor with asymptotic complexity analysis ($O(N)$), multi-turn context memory, and automated resume skill gap analysis.

---

## 🌟 Key Features

- **🏢 Company-Specific Personas**: Google Bar Raisers, Amazon Leadership Evaluators, Microsoft System Architects, Meta Production Engineering Leads, TCS/Infosys Tech Leads.
- **💻 Live Code Workspace**: Multi-language code editor (Python, JS, Java, C++) with syntax highlighting and $O(N)$ complexity evaluation.
- **🧠 Multi-Turn Context Memory**: AI interviewers reference prior candidate statements to ask probing follow-up questions.
- **📊 AI Resume Skill Gap Analysis**: Upload PDF resumes to compute role readiness percentage ($78\%$), matching strengths, and missing skills.
- **⏩ Question Skipping & Penalty**: Skip questions with score penalty and real-time micro-feedback.
- **🔒 Privacy-First Architecture**: Supabase PostgreSQL database integration with zero data monetization.

---

## 🚀 How to Deploy

### 1. Deploy Backend to Render (Free)

1. Go to **[Render Dashboard](https://dashboard.render.com)** and click **New + → Web Service**.
2. Connect your GitHub repository.
3. Set the following build and start settings:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add the following **Environment Variables** in Render:
   - `DATABASE_URL`: `postgresql://postgres:YOUR_PASSWORD@db.jpuluyhivdkvfzxmcgpq.supabase.co:5432/postgres`
   - `GEMINI_API_KEY`: Your API Key from [Google AI Studio](https://aistudio.google.com)
   - `SECRET_KEY`: Any random 32-character string
   - `CORS_ORIGINS`: `https://your-frontend.vercel.app`
5. Click **Create Web Service**. Render will give you a backend URL (e.g. `https://hiremind-backend.onrender.com`).

---

### 2. Deploy Frontend to Vercel (Free)

1. Go to **[Vercel Dashboard](https://vercel.com/new)** and click **Import Project**.
2. Select your GitHub repository.
3. Configure the framework and environment:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
4. Add **Environment Variable** in Vercel:
   - `VITE_API_BASE_URL`: `https://hiremind-backend.onrender.com/api` *(your Render backend URL + `/api`)*
5. Click **Deploy**. Vercel will give you a live website URL (e.g. `https://hiremind.vercel.app`).

---

## 🛠️ Local Development

### Backend (FastAPI):
```bash
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1   # On Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend (React + Vite):
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.
