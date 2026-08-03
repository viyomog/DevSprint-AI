from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# --- Auth Schemas ---
class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    target_role: Optional[str] = "Software Engineer"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    target_role: str
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# --- Resume Schemas ---
class ResumeResponse(BaseModel):
    id: int
    filename: str
    skills: List[str]
    experience_summary: str
    uploaded_at: datetime

    class Config:
        from_attributes = True

class SkillGapResponse(BaseModel):
    matching_skills: List[str]
    missing_skills: List[str]
    readiness_percentage: int
    recommendations: List[str]

# --- Interview Schemas ---
class InterviewCreate(BaseModel):
    company: str
    role: str
    experience_level: str
    difficulty: str
    interview_type: str
    total_questions: Optional[int] = 5

class AnswerSubmit(BaseModel):
    interview_id: int
    question_number: int
    user_answer: str
    is_skipped: Optional[bool] = False

class CodeSubmit(BaseModel):
    interview_id: int
    question_number: int
    code_snippet: str
    language: Optional[str] = "python"

class CodeEvaluationResponse(BaseModel):
    syntax_correct: bool
    logic_score: float
    time_complexity: str
    space_complexity: str
    overall_score: float
    feedback_good: str
    feedback_issues: str
    optimized_code: Optional[str] = None

class QNAEvaluationResponse(BaseModel):
    question_number: int
    question: str
    user_answer: str
    technical_score: float
    communication_score: float
    clarity_score: float
    completeness_score: float
    overall_score: float
    feedback_good: str
    feedback_missing: str
    feedback_improvement: str
    next_question: Optional[str] = None
    is_finished: bool = False

class CategoryScore(BaseModel):
    name: str
    score: float

class FinalReportResponse(BaseModel):
    interview_id: int
    company: str
    role: str
    experience_level: str
    difficulty: str
    overall_score: float
    hiring_recommendation: str
    summary: str
    category_scores: List[CategoryScore]
    strengths: List[str]
    weaknesses: List[str]
    suggested_improvements: List[str]
    qnas: List[QNAEvaluationResponse]
    created_at: datetime

class InterviewSummaryResponse(BaseModel):
    id: int
    company: str
    role: str
    difficulty: str
    status: str
    overall_score: float
    hiring_recommendation: str
    created_at: datetime

    class Config:
        from_attributes = True

class DashboardStatsResponse(BaseModel):
    total_interviews: int
    avg_score: float
    top_strengths: List[str]
    weak_areas: List[str]
    recent_interviews: List[InterviewSummaryResponse]
