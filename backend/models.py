from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(200), nullable=False)
    target_role = Column(String(100), default="Software Engineer")
    created_at = Column(DateTime, default=datetime.utcnow)

    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
    interviews = relationship("Interview", back_populates="user", cascade="all, delete-orphan")

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    filename = Column(String(200), nullable=False)
    skills = Column(Text, default="")
    experience_summary = Column(Text, default="")
    raw_text = Column(Text, default="")
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="resumes")

class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    company = Column(String(100), nullable=False)
    role = Column(String(100), nullable=False)
    experience_level = Column(String(50), nullable=False)
    difficulty = Column(String(50), nullable=False)
    interview_type = Column(String(50), nullable=False)
    status = Column(String(50), default="in_progress")  # in_progress, completed
    total_questions = Column(Integer, default=5)
    current_question_index = Column(Integer, default=0)
    overall_score = Column(Float, default=0.0)
    hiring_recommendation = Column(String(50), default="Pending")
    summary = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="interviews")
    qnas = relationship("InterviewQNA", back_populates="interview", cascade="all, delete-orphan")

class InterviewQNA(Base):
    __tablename__ = "interview_qnas"

    id = Column(Integer, primary_key=True, index=True)
    interview_id = Column(Integer, ForeignKey("interviews.id"), nullable=False)
    question_number = Column(Integer, nullable=False)
    question = Column(Text, nullable=False)
    user_answer = Column(Text, default="")
    technical_score = Column(Float, default=0.0)
    communication_score = Column(Float, default=0.0)
    clarity_score = Column(Float, default=0.0)
    completeness_score = Column(Float, default=0.0)
    overall_score = Column(Float, default=0.0)
    feedback_good = Column(Text, default="")
    feedback_missing = Column(Text, default="")
    feedback_improvement = Column(Text, default="")
    answered_at = Column(DateTime, default=datetime.utcnow)

    interview = relationship("Interview", back_populates="qnas")
