import os
import time
from collections import defaultdict
from fastapi import FastAPI, Request, Response, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from database import engine, Base
import routers.auth as auth_router
import routers.resume as resume_router
import routers.interviews as interviews_router

# Create database tables automatically on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="HireMind API",
    description="AI Interview Simulator Backend API with Rate Limiting & Security Protection",
    version="1.0.0"
)

# --- Rate Limiting In-Memory Store ---
# Limits requests to 120 per minute per IP address
RATE_LIMIT_WINDOW = 60  # seconds
MAX_REQUESTS_PER_WINDOW = 120  # max requests per minute
client_request_history = defaultdict(list)

@app.middleware("http")
async def rate_limit_and_security_middleware(request: Request, call_next):
    client_ip = request.client.host if request.client else "127.0.0.1"
    now = time.time()

    # Clean up history entries older than 60s
    window_start = now - RATE_LIMIT_WINDOW
    client_request_history[client_ip] = [t for t in client_request_history[client_ip] if t > window_start]

    if len(client_request_history[client_ip]) >= MAX_REQUESTS_PER_WINDOW:
        return Response(
            content='{"detail": "Rate limit exceeded. Please wait a minute before making more requests."}',
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            media_type="application/json"
        )

    client_request_history[client_ip].append(now)

    response: Response = await call_next(request)

    # Inject Production Security Headers
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"

    return response


# Configure CORS origins for Frontend communication
cors_origins_str = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
origins = [origin.strip() for origin in cors_origins_str.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth_router.router)
app.include_router(resume_router.router)
app.include_router(interviews_router.router)

@app.get("/")
def root():
    return {
        "status": "online",
        "app": "HireMind AI Interview Simulator API",
        "version": "1.0.0",
        "docs": "/docs",
        "rate_limiting": "Enabled (120 req/min)",
        "max_file_upload": "5 MB"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
