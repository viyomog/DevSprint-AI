import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
import auth_utils
import ai_service

router = APIRouter(prefix="/api/interviews", tags=["Interviews"])

@router.post("/create")
def create_interview(
    data: schemas.InterviewCreate,
    current_user: models.User = Depends(auth_utils.get_current_user),
    db: Session = Depends(get_db)
):
    latest_resume = db.query(models.Resume).filter(models.Resume.user_id == current_user.id).order_by(models.Resume.uploaded_at.desc()).first()
    skills = []
    if latest_resume and latest_resume.skills:
        try:
            skills = json.loads(latest_resume.skills)
        except Exception:
            skills = []

    first_q = ai_service.generate_first_question(
        company=data.company,
        role=data.role,
        experience_level=data.experience_level,
        difficulty=data.difficulty,
        interview_type=data.interview_type,
        resume_skills=skills
    )

    new_interview = models.Interview(
        user_id=current_user.id,
        company=data.company,
        role=data.role,
        experience_level=data.experience_level,
        difficulty=data.difficulty,
        interview_type=data.interview_type,
        total_questions=data.total_questions or 5,
        current_question_index=1,
        status="in_progress"
    )
    db.add(new_interview)
    db.commit()
    db.refresh(new_interview)

    first_qna = models.InterviewQNA(
        interview_id=new_interview.id,
        question_number=1,
        question=first_q
    )
    db.add(first_qna)
    db.commit()

    return {
        "interview_id": new_interview.id,
        "company": new_interview.company,
        "role": new_interview.role,
        "question_number": 1,
        "total_questions": new_interview.total_questions,
        "question": first_q
    }

@router.get("/{interview_id}")
def get_interview_session(
    interview_id: int,
    current_user: models.User = Depends(auth_utils.get_current_user),
    db: Session = Depends(get_db)
):
    interview = db.query(models.Interview).filter(models.Interview.id == interview_id, models.Interview.user_id == current_user.id).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    qnas = db.query(models.InterviewQNA).filter(models.InterviewQNA.interview_id == interview_id).order_by(models.InterviewQNA.question_number).all()

    return {
        "interview_id": interview.id,
        "company": interview.company,
        "role": interview.role,
        "experience_level": interview.experience_level,
        "difficulty": interview.difficulty,
        "interview_type": interview.interview_type,
        "status": interview.status,
        "total_questions": interview.total_questions,
        "current_question_index": interview.current_question_index,
        "overall_score": interview.overall_score,
        "qnas": [
            {
                "question_number": q.question_number,
                "question": q.question,
                "user_answer": q.user_answer,
                "technical_score": q.technical_score,
                "communication_score": q.communication_score,
                "clarity_score": q.clarity_score,
                "completeness_score": q.completeness_score,
                "overall_score": q.overall_score,
                "feedback_good": q.feedback_good,
                "feedback_missing": q.feedback_missing,
                "feedback_improvement": q.feedback_improvement
            } for q in qnas
        ]
    }

@router.post("/answer", response_model=schemas.QNAEvaluationResponse)
def submit_answer(
    data: schemas.AnswerSubmit,
    current_user: models.User = Depends(auth_utils.get_current_user),
    db: Session = Depends(get_db)
):
    interview = db.query(models.Interview).filter(models.Interview.id == data.interview_id, models.Interview.user_id == current_user.id).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    qna = db.query(models.InterviewQNA).filter(
        models.InterviewQNA.interview_id == data.interview_id,
        models.InterviewQNA.question_number == data.question_number
    ).first()

    if not qna:
        raise HTTPException(status_code=404, detail="Question entry not found")

    user_ans = "Skipped by candidate" if data.is_skipped else data.user_answer
    qna.user_answer = user_ans

    previous_qnas_raw = db.query(models.InterviewQNA).filter(
        models.InterviewQNA.interview_id == interview.id,
        models.InterviewQNA.question_number < data.question_number
    ).order_by(models.InterviewQNA.question_number).all()

    prev_qnas_list = [{"question": p.question, "user_answer": p.user_answer} for p in previous_qnas_raw]

    eval_result = ai_service.evaluate_answer_and_generate_next(
        company=interview.company,
        role=interview.role,
        experience_level=interview.experience_level,
        difficulty=interview.difficulty,
        question_number=data.question_number,
        total_questions=interview.total_questions,
        question=qna.question,
        user_answer=user_ans,
        previous_qnas=prev_qnas_list,
        is_skipped=bool(data.is_skipped)
    )

    qna.technical_score = eval_result.get("technical_score", 7.0)
    qna.communication_score = eval_result.get("communication_score", 7.0)
    qna.clarity_score = eval_result.get("clarity_score", 7.0)
    qna.completeness_score = eval_result.get("completeness_score", 7.0)
    qna.overall_score = eval_result.get("overall_score", 7.0)
    qna.feedback_good = eval_result.get("feedback_good", "")
    qna.feedback_missing = eval_result.get("feedback_missing", "")
    qna.feedback_improvement = eval_result.get("feedback_improvement", "")

    next_question = eval_result.get("next_question")
    is_finished = False

    if data.question_number < interview.total_questions and next_question:
        interview.current_question_index = data.question_number + 1
        existing_next = db.query(models.InterviewQNA).filter(
            models.InterviewQNA.interview_id == interview.id,
            models.InterviewQNA.question_number == data.question_number + 1
        ).first()
        if not existing_next:
            new_next_qna = models.InterviewQNA(
                interview_id=interview.id,
                question_number=data.question_number + 1,
                question=next_question
            )
            db.add(new_next_qna)
    else:
        is_finished = True
        interview.status = "completed"

    db.commit()

    return {
        "question_number": qna.question_number,
        "question": qna.question,
        "user_answer": qna.user_answer,
        "technical_score": qna.technical_score,
        "communication_score": qna.communication_score,
        "clarity_score": qna.clarity_score,
        "completeness_score": qna.completeness_score,
        "overall_score": qna.overall_score,
        "feedback_good": qna.feedback_good,
        "feedback_missing": qna.feedback_missing,
        "feedback_improvement": qna.feedback_improvement,
        "next_question": next_question,
        "is_finished": is_finished
    }

@router.post("/code-eval", response_model=schemas.CodeEvaluationResponse)
def evaluate_code(
    data: schemas.CodeSubmit,
    current_user: models.User = Depends(auth_utils.get_current_user),
    db: Session = Depends(get_db)
):
    interview = db.query(models.Interview).filter(models.Interview.id == data.interview_id, models.Interview.user_id == current_user.id).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview session not found")

    qna = db.query(models.InterviewQNA).filter(
        models.InterviewQNA.interview_id == data.interview_id,
        models.InterviewQNA.question_number == data.question_number
    ).first()

    question_text = qna.question if qna else "Technical Coding Question"

    result = ai_service.evaluate_code_response(
        company=interview.company,
        role=interview.role,
        question=question_text,
        code_snippet=data.code_snippet,
        language=data.language or "python"
    )

    return result

@router.get("/{interview_id}/report", response_model=schemas.FinalReportResponse)
def get_final_report(
    interview_id: int,
    current_user: models.User = Depends(auth_utils.get_current_user),
    db: Session = Depends(get_db)
):
    interview = db.query(models.Interview).filter(models.Interview.id == interview_id, models.Interview.user_id == current_user.id).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    qnas = db.query(models.InterviewQNA).filter(models.InterviewQNA.interview_id == interview_id).order_by(models.InterviewQNA.question_number).all()

    report_data = ai_service.generate_final_report(interview.company, interview.role, qnas)

    interview.overall_score = report_data["overall_score"]
    interview.hiring_recommendation = report_data["hiring_recommendation"]
    interview.summary = report_data["summary"]
    db.commit()

    qna_responses = [
        {
            "question_number": q.question_number,
            "question": q.question,
            "user_answer": q.user_answer,
            "technical_score": q.technical_score,
            "communication_score": q.communication_score,
            "clarity_score": q.clarity_score,
            "completeness_score": q.completeness_score,
            "overall_score": q.overall_score,
            "feedback_good": q.feedback_good,
            "feedback_missing": q.feedback_missing,
            "feedback_improvement": q.feedback_improvement,
            "next_question": None,
            "is_finished": True
        } for q in qnas
    ]

    return {
        "interview_id": interview.id,
        "company": interview.company,
        "role": interview.role,
        "experience_level": interview.experience_level,
        "difficulty": interview.difficulty,
        "overall_score": report_data["overall_score"],
        "hiring_recommendation": report_data["hiring_recommendation"],
        "summary": report_data["summary"],
        "category_scores": [schemas.CategoryScore(**c) for c in report_data["category_scores"]],
        "strengths": report_data["strengths"],
        "weaknesses": report_data["weaknesses"],
        "suggested_improvements": report_data["suggested_improvements"],
        "qnas": qna_responses,
        "created_at": interview.created_at
    }

@router.get("/dashboard/stats", response_model=schemas.DashboardStatsResponse)
def get_dashboard_stats(
    current_user: models.User = Depends(auth_utils.get_current_user),
    db: Session = Depends(get_db)
):
    interviews = db.query(models.Interview).filter(models.Interview.user_id == current_user.id).order_by(models.Interview.created_at.desc()).all()

    total_count = len(interviews)
    completed_interviews = [i for i in interviews if i.status == "completed" and i.overall_score > 0]

    avg_score = 0.0
    if completed_interviews:
        avg_score = round(sum(i.overall_score for i in completed_interviews) / len(completed_interviews), 1)

    top_strengths = ["Technical Clarity", "Structured Problem Solving", "Context Awareness"]
    weak_areas = ["System Design Trade-offs", "Quantitative Metrics"]

    return {
        "total_interviews": total_count,
        "avg_score": avg_score,
        "top_strengths": top_strengths,
        "weak_areas": weak_areas,
        "recent_interviews": interviews[:5]
    }
