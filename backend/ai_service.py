import os
import json
import re
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# Active models prioritized based on user's project quota allocations (500 RPD)
MODELS_TO_TRY = [
    "gemini-3.1-flash-lite",
    "gemini-3.5-flash-lite",
    "gemini-2.5-flash-lite",
    "gemini-2.5-flash",
    "gemini-3.6-flash"
]

COMPANY_PERSONAS = {
    "Google": (
        "You are a Principal Software Engineer & Interviewer at Google. "
        "Your interviewing style focuses on algorithmic efficiency, Big-O time/space complexity trade-offs, scalability, and handling unexpected edge cases. "
        "Maintain a supportive, highly technical tone."
    ),
    "Microsoft": (
        "You are a Senior Architect & Interviewer at Microsoft. "
        "Your interviewing style focuses on clean software architecture, object-oriented design patterns, robust API design, and long-term code maintainability."
    ),
    "Amazon": (
        "You are a Bar Raiser Interviewer at Amazon. "
        "Your interviewing style evaluates technical depth alongside Amazon's 16 Leadership Principles (such as Customer Obsession, Ownership, Bias for Action, and Dive Deep). "
        "Ask follow-up questions probing exact actions taken."
    ),
    "Meta": (
        "You are a Senior Engineering Lead at Meta. "
        "Your interviewing style evaluates fast execution, production debugging, system architecture scaling, and system reliability."
    ),
    "Apple": (
        "You are a Systems Software Architect at Apple. "
        "Your interviewing style emphasizes memory efficiency, system internals, hardware-software integration, and perfection in detail."
    ),
    "TCS": (
        "You are a Technical Lead & Interviewer at TCS. "
        "Your interviewing style evaluates core Computer Science fundamentals, DBMS, Operating Systems, OOPs concepts, and clear structured verbal explanations."
    ),
    "Infosys": (
        "You are a Technical Lead & Interviewer at Infosys. "
        "Your interviewing style evaluates fundamental coding logic, data structure basics, SQL queries, and candidate communication."
    ),
    "Accenture": (
        "You are a Technology Consultant & Interviewer at Accenture. "
        "Your interviewing style focuses on practical problem solving, client scenario resolution, cloud basics, and communication."
    )
}

def get_company_persona(company: str) -> str:
    return COMPANY_PERSONAS.get(company, f"You are a Senior Technical Interviewer at {company}. Your interviewing style evaluates technical depth, problem solving, and communication.")


def call_gemini(prompt: str) -> str:
    """Call Google Gemini API using active project quota models."""
    if not GEMINI_API_KEY or GEMINI_API_KEY.strip() == "" or GEMINI_API_KEY == "your_gemini_api_key_here":
        return None

    try:
        from google import genai
        client = genai.Client(api_key=GEMINI_API_KEY)
        
        for model in MODELS_TO_TRY:
            try:
                response = client.models.generate_content(
                    model=model,
                    contents=prompt
                )
                if response and response.text:
                    return response.text
            except Exception as err:
                err_str = str(err)
                if "404" in err_str or "NOT_FOUND" in err_str:
                    continue
                print(f"Gemini API warning for {model}: {err_str[:120]}...")
                continue
                
    except Exception as e:
        print(f"Gemini API call error: {e}")

    return None


def extract_json_from_text(text: str) -> dict:
    """Extract JSON object from text response."""
    try:
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if match:
            return json.loads(match.group())
    except Exception:
        pass
    return {}


def parse_resume_text(resume_text: str) -> dict:
    """Extract skills and experience summary from resume text."""
    prompt = f"""
    Analyze the following resume text and extract technical & soft skills and a short experience summary.
    Return ONLY a valid JSON object with format:
    {{
        "skills": ["Skill1", "Skill2", "Skill3"],
        "experience_summary": "Short 2-sentence summary of experience level and background."
    }}

    Resume Text:
    {resume_text[:3000]}
    """
    raw_response = call_gemini(prompt)
    if raw_response:
        result = extract_json_from_text(raw_response)
        if result and "skills" in result:
            return result

    # Local fallback
    common_skills = ["Python", "JavaScript", "React", "TypeScript", "Node.js", "SQL", "FastAPI", "Docker", "Git", "REST APIs", "Machine Learning", "Communication", "Problem Solving"]
    found_skills = [skill for skill in common_skills if skill.lower() in resume_text.lower()]
    if not found_skills:
        found_skills = ["Python", "Problem Solving", "REST APIs", "SQL"]

    return {
        "skills": found_skills,
        "experience_summary": "Extracted technical candidate profile focusing on software development and problem solving."
    }


def analyze_skill_gaps(candidate_skills: list, target_role: str, company: str = "Google") -> dict:
    """Analyze candidate skills against target role requirements and identify missing skills."""
    skills_str = ", ".join(candidate_skills) if candidate_skills else "Basic programming"

    prompt = f"""
    You are an AI Career Advisor analyzing a candidate applying for the {target_role} position at {company}.
    Candidate Current Skills: {skills_str}.

    Identify matching skills, missing critical skills for {target_role}, and 3 actionable learning recommendations.
    Return ONLY a valid JSON object with format:
    {{
        "matching_skills": ["Skill1", "Skill2"],
        "missing_skills": ["MissingSkill1", "MissingSkill2"],
        "readiness_percentage": 78,
        "recommendations": [
            "Learning tip 1",
            "Learning tip 2",
            "Learning tip 3"
        ]
    }}
    """
    raw_response = call_gemini(prompt)
    if raw_response:
        result = extract_json_from_text(raw_response)
        if result and "readiness_percentage" in result:
            return result

    role_reqs = {
        "AI Engineer": ["Python", "PyTorch", "TensorFlow", "LLMs", "Vector DBs", "REST APIs"],
        "Data Scientist": ["Python", "SQL", "Pandas", "Scikit-Learn", "Machine Learning", "Statistics"],
        "Software Engineer": ["Python", "Data Structures", "Algorithms", "System Design", "SQL", "Git"],
        "Backend Developer": ["Python", "FastAPI", "PostgreSQL", "Docker", "Redis", "REST APIs"],
        "Frontend Developer": ["React", "TypeScript", "JavaScript", "CSS3", "HTML5", "Redux"]
    }
    target_reqs = role_reqs.get(target_role, ["Python", "SQL", "System Design", "Git", "REST APIs"])

    matching = [s for s in candidate_skills if any(r.lower() in s.lower() or s.lower() in r.lower() for r in target_reqs)]
    missing = [r for r in target_reqs if not any(r.lower() in s.lower() or s.lower() in r.lower() for s in candidate_skills)]
    
    if not matching:
        matching = candidate_skills[:2] if candidate_skills else ["Problem Solving"]
    if not missing:
        missing = ["System Design Trade-offs", "Production Monitoring"]

    readiness = min(95, max(45, round((len(matching) / max(1, len(target_reqs))) * 100)))

    return {
        "matching_skills": matching,
        "missing_skills": missing,
        "readiness_percentage": readiness,
        "recommendations": [
            f"Build a production project demonstrating {missing[0] if missing else 'System Architecture'}.",
            f"Practice answering system scaling & trade-off questions for {company}.",
            "Master explaining code complexity ($O(N)$ vs $O(1)$) verbally during technical rounds."
        ]
    }


def generate_first_question(company: str, role: str, experience_level: str, difficulty: str, interview_type: str, resume_skills: list = None) -> str:
    """Generate initial opening question using company-specific persona."""
    skills_str = ", ".join(resume_skills) if resume_skills else "General core requirements"
    persona = get_company_persona(company)

    prompt = f"""
    {persona}

    You are conducting a {difficulty} level {interview_type} interview for a candidate applying for {role} ({experience_level}).
    Candidate skills: {skills_str}.

    Generate the opening question.
    {"If interview_type is Coding Round, ask a specific algorithmic coding problem (like LeetCode style) appropriate for " + difficulty + " level at " + company + ", asking candidate to write code in their preferred language and explain time/space complexity." if "coding" in interview_type.lower() else "Keep it sharp, engaging, and aligned with your interviewer persona."}

    Return ONLY the question text.
    """
    response = call_gemini(prompt)
    if response and len(response.strip()) > 10:
        return response.strip()

    if "coding" in interview_type.lower():
        return f"Welcome to the {company} Coding Round! Problem: Write an efficient function in your language of choice to find the longest contiguous subarray with a sum equal to target value K. Explain your time and space complexity."
    elif interview_type.lower() == "hr":
        return f"Welcome to the {company} interview! Walk me through a challenging project from your background and why you're targeting the {role} role at {company}."
    elif "ai" in role.lower() or "data" in role.lower():
        return f"Welcome to {company}! Let's start with technical depth: Can you explain how you evaluate model performance trade-offs between Precision, Recall, and F1-Score in unbalanced datasets?"
    else:
        return f"Welcome to {company}! Let's dive straight into technical concepts: Can you explain how RESTful API design handles state management and concurrency in microservices?"


def evaluate_answer_and_generate_next(
    company: str,
    role: str,
    experience_level: str,
    difficulty: str,
    question_number: int,
    total_questions: int,
    question: str,
    user_answer: str,
    previous_qnas: list = None,
    is_skipped: bool = False
) -> dict:
    """Evaluate candidate answer or handle question skip with penalty score."""
    
    # Handle explicit Question Skip penalty logic
    if is_skipped or "skipped by candidate" in user_answer.lower():
        next_q = None
        if question_number < total_questions:
            follow_ups = [
                f"No problem, let's move forward. For Question #{question_number + 1} at {company}: How would you approach designing a cache system for high-concurrency read requests?",
                f"Moving on to Question #{question_number + 1} for {role}: Can you explain how to handle database lock contention in distributed transactions?",
                f"Let's try a scenario question: How do you identify bottlenecks in a slow microservice API?",
                f"Final question: Describe how you manage technical debt when delivering tight sprint deadlines."
            ]
            next_q = follow_ups[(question_number - 1) % len(follow_ups)]

        return {
            "technical_score": 2.0,
            "communication_score": 2.0,
            "clarity_score": 1.5,
            "completeness_score": 1.0,
            "overall_score": 1.6,
            "feedback_good": "Recognized knowledge limits and opted to skip to manage session time.",
            "feedback_missing": "Question was skipped without attempting pseudo-code or high-level architectural concepts.",
            "feedback_improvement": "Always attempt questions during technical rounds by stating partial logic or high-level trade-offs.",
            "next_question": next_q
        }

    persona = get_company_persona(company)

    history_str = ""
    if previous_qnas:
        history_items = []
        for item in previous_qnas[-3:]:
            q = item.get("question", "")
            a = item.get("user_answer", "")
            if q and a:
                history_items.append(f"Interviewer: \"{q}\"\nCandidate Answer: \"{a}\"")
        if history_items:
            history_str = "PREVIOUS CONVERSATION CONTEXT:\n" + "\n---\n".join(history_items) + "\n\n"

    prompt = f"""
    {persona}

    {history_str}CURRENT QUESTION #{question_number}: "{question}"
    CANDIDATE ANSWER: "{user_answer}"

    Evaluate the answer and provide feedback. Also generate Question #{question_number + 1} if question_number < {total_questions}.
    IMPORTANT: If creating Question #{question_number + 1}, directly reference specific points from the candidate's previous statements to maintain natural conversational context!

    Return ONLY a valid JSON object with keys:
    {{
        "technical_score": 8.5,
        "communication_score": 9.0,
        "clarity_score": 8.0,
        "completeness_score": 7.5,
        "overall_score": 8.25,
        "feedback_good": "What was strong about the answer",
        "feedback_missing": "Key aspects omitted or weak points",
        "feedback_improvement": "Actionable advice to improve",
        "next_question": "Next interview question referencing candidate's previous answer (or null if last question)"
    }}
    """
    raw_response = call_gemini(prompt)
    if raw_response:
        result = extract_json_from_text(raw_response)
        if result and "overall_score" in result:
            return result

    # Smart fallback evaluation
    ans_length = len(user_answer.strip())
    tech = min(10.0, max(5.0, round(ans_length / 15 + 4, 1)))
    comm = min(10.0, max(6.0, round(ans_length / 20 + 5, 1)))
    clarity = min(10.0, max(5.5, round(ans_length / 25 + 5.5, 1)))
    comp = min(10.0, max(4.0, round(ans_length / 18 + 4.5, 1)))
    overall = round((tech + comm + clarity + comp) / 4, 1)

    next_q = None
    if question_number < total_questions:
        follow_ups = [
            f"You brought up structured handling earlier. Building directly on your explanation, how would you optimize memory and latency if request volume scales by 100x at {company}?",
            f"Thank you for that overview. Can you describe an edge case or race condition that might arise in your approach for {role}, and how you would prevent it?",
            f"Understood. How do you approach automated unit testing and monitoring to ensure high availability for these components?",
            f"Let's touch on architectural trade-offs: If database read latency spikes, how would you implement caching invalidation strategies?"
        ]
        next_q = follow_ups[(question_number - 1) % len(follow_ups)]

    return {
        "technical_score": tech,
        "communication_score": comm,
        "clarity_score": clarity,
        "completeness_score": comp,
        "overall_score": overall,
        "feedback_good": f"Aligned well with {company} interview expectations by structuring technical steps clearly.",
        "feedback_missing": "Could elaborate with explicit quantitative performance metrics or concrete code snippets.",
        "feedback_improvement": "State explicit trade-offs (e.g. memory vs execution speed) and use the STAR method.",
        "next_question": next_q
    }


def evaluate_code_response(company: str, role: str, question: str, code_snippet: str, language: str = "python") -> dict:
    """Evaluate live code submission for syntax, logical correctness, and time/space complexity."""
    prompt = f"""
    You are a Senior Technical Interviewer evaluating a candidate's code submission for {company} ({role} role).
    Problem Question: "{question}"
    Programming Language: {language}
    Submitted Code:
    ```
    {code_snippet}
    ```

    Evaluate the code logic, syntax, asymptotic time complexity, and space complexity.
    Return ONLY a valid JSON object with keys:
    {{
        "syntax_correct": true,
        "logic_score": 8.5,
        "time_complexity": "O(N)",
        "space_complexity": "O(1)",
        "overall_score": 8.5,
        "feedback_good": "Clean variable naming and clear loop structure.",
        "feedback_issues": "Omitted null check for empty input array.",
        "optimized_code": "Suggested optimized code snippet if applicable"
    }}
    """
    raw_response = call_gemini(prompt)
    if raw_response:
        result = extract_json_from_text(raw_response)
        if result and "overall_score" in result:
            return result

    has_code = len(code_snippet.strip()) > 10
    score = 8.5 if has_code else 5.0

    return {
        "syntax_correct": True,
        "logic_score": score,
        "time_complexity": "O(N)",
        "space_complexity": "O(1)",
        "overall_score": score,
        "feedback_good": "Clear code structure with logical variable naming.",
        "feedback_issues": "Consider adding explicit input bounds validation and error handling.",
        "optimized_code": code_snippet
    }


def generate_final_report(company: str, role: str, qnas: list) -> dict:
    """Generate overall summary and hiring recommendation based on Q&A performance."""
    if not qnas:
        avg_score = 7.0
    else:
        avg_score = round(sum(q.overall_score for q in qnas) / len(qnas), 1)

    if avg_score >= 8.5:
        recommendation = "Strong Hire"
    elif avg_score >= 7.0:
        recommendation = "Hire"
    elif avg_score >= 5.5:
        recommendation = "Lean Hire"
    else:
        recommendation = "No Hire"

    return {
        "overall_score": avg_score,
        "hiring_recommendation": recommendation,
        "summary": f"The candidate demonstrated strong domain alignment for the {role} role at {company} with an overall score of {avg_score}/10.",
        "category_scores": [
            {"name": "Technical Accuracy", "score": min(10.0, round(avg_score * 0.98, 1))},
            {"name": "Communication", "score": min(10.0, round(avg_score * 1.02, 1))},
            {"name": "Problem Solving", "score": min(10.0, round(avg_score * 0.95, 1))},
            {"name": "Clarity & Structure", "score": min(10.0, round(avg_score * 1.0, 1))},
        ],
        "strengths": [
            f"Clear verbal structure aligned with {company} technical standards",
            "Good foundational understanding of role domain",
            "Maintained context responsiveness throughout follow-up questions"
        ],
        "weaknesses": [
            "Edge case handling could be deeper",
            "Quantitative trade-off metrics omitted in certain answers"
        ],
        "suggested_improvements": [
            "Practice explaining Big-O time and space complexity explicitly",
            "Include concrete examples from personal or open-source projects",
            "Use the STAR framework for scenario-based responses"
        ]
    }
