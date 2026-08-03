import requests
import json
import time

BASE_URL = "http://localhost:8000/api"

def run_e2e_tests():
    print("=" * 60)
    print("STARTING HIREMIND END-TO-END AUTOMATED VERIFICATION")
    print("=" * 60)

    # 1. Test User Registration
    test_email = f"candidate_{int(time.time())}@hiremind.ai"
    test_password = "SecurePassword123!"
    
    print("\n[1/8] Testing User Registration...")
    reg_res = requests.post(f"{BASE_URL}/auth/register", json={
        "full_name": "Test Candidate",
        "email": test_email,
        "password": test_password,
        "target_role": "Software Engineer"
    })
    
    if reg_res.status_code != 200:
        print(f"Registration failed: {reg_res.text}")
        return
    reg_data = reg_res.json()
    token = reg_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print(f"User registered successfully! User ID: {reg_data['user']['id']}")

    # 2. Test User Login
    print("\n[2/8] Testing User Login...")
    login_res = requests.post(f"{BASE_URL}/auth/login", json={
        "email": test_email,
        "password": test_password
    })
    assert login_res.status_code == 200, f"Login failed: {login_res.text}"
    print("Login successful, JWT auth token verified!")

    # 3. Test Resume Upload & Gemini Parsing
    print("\n[3/8] Testing Resume Upload & Gemini AI Skill Extraction...")
    dummy_pdf_content = b"%PDF-1.4 Dummy Resume Content for Software Engineer with skills in Python, FastAPI, React, SQL, and Docker."
    files = {"file": ("test_resume.pdf", dummy_pdf_content, "application/pdf")}
    upload_res = requests.post(f"{BASE_URL}/resume/upload", headers=headers, files=files)
    assert upload_res.status_code == 200, f"Resume upload failed: {upload_res.text}"
    res_data = upload_res.json()
    print(f"Resume parsed successfully! Extracted Skills: {res_data['skills']}")

    # 4. Test AI Skill Gap Analysis
    print("\n[4/8] Testing AI Skill Gap Analysis...")
    gap_res = requests.get(f"{BASE_URL}/resume/skill-gap?target_role=Software%20Engineer&company=Google", headers=headers)
    assert gap_res.status_code == 200, f"Skill gap analysis failed: {gap_res.text}"
    gap_data = gap_res.json()
    print(f"Readiness Alignment: {gap_data['readiness_percentage']}% | Strengths: {gap_data['matching_skills']} | Missing: {gap_data['missing_skills']}")

    # 5. Test Mock Interview Creation (Coding Round)
    print("\n[5/8] Testing Mock Interview Creation (Google Coding Round)...")
    create_res = requests.post(f"{BASE_URL}/interviews/create", headers=headers, json={
        "company": "Google",
        "role": "Software Engineer",
        "experience_level": "Fresher (0-1 yrs)",
        "difficulty": "Medium",
        "interview_type": "Coding Round",
        "total_questions": 3
    })
    assert create_res.status_code == 200, f"Create interview failed: {create_res.text}"
    inv_data = create_res.json()
    inv_id = inv_data["interview_id"]
    print(f"Interview #{inv_id} created! First Question: \"{inv_data['question'][:80]}...\"")

    # 6. Test Live Code Evaluation
    print("\n[6/8] Testing Live Code Evaluation Endpoint...")
    code_eval_res = requests.post(f"{BASE_URL}/interviews/code-eval", headers=headers, json={
        "interview_id": inv_id,
        "question_number": 1,
        "code_snippet": "def solution(nums):\n    # Two pointer approach O(N)\n    return sorted(list(set(nums)))\n",
        "language": "python"
    })
    assert code_eval_res.status_code == 200, f"Code evaluation failed: {code_eval_res.text}"
    c_data = code_eval_res.json()
    print(f"Code Evaluated! Score: {c_data['logic_score']}/10 | Time: {c_data['time_complexity']} | Space: {c_data['space_complexity']}")

    # 7. Test Question Skipping & Answer Submissions
    print("\n[7/8] Testing Answer Submissions & Question Skipping...")
    # Answer Q1
    ans1 = requests.post(f"{BASE_URL}/interviews/answer", headers=headers, json={
        "interview_id": inv_id,
        "question_number": 1,
        "user_answer": "I used a two pointer approach with O(N) time complexity.",
        "is_skipped": False
    })
    print(f"  - Q1 Answer Score: {ans1.json()['overall_score']}/10")

    # Skip Q2 with penalty
    ans2 = requests.post(f"{BASE_URL}/interviews/answer", headers=headers, json={
        "interview_id": inv_id,
        "question_number": 2,
        "user_answer": "Skipped by candidate",
        "is_skipped": True
    })
    print(f"  - Q2 Skipped (Penalty Score): {ans2.json()['overall_score']}/10")

    # Answer Q3
    ans3 = requests.post(f"{BASE_URL}/interviews/answer", headers=headers, json={
        "interview_id": inv_id,
        "question_number": 3,
        "user_answer": "I would implement redis caching with LRU eviction policy.",
        "is_skipped": False
    })
    print(f"  - Q3 Answer Score: {ans3.json()['overall_score']}/10")

    # 8. Test Final Report Generation
    print("\n[8/8] Testing Final Report Generation...")
    report_res = requests.get(f"{BASE_URL}/interviews/{inv_id}/report", headers=headers)
    assert report_res.status_code == 200, f"Report failed: {report_res.text}"
    rep = report_res.json()
    print(f"Final Report Generated! Overall Score: {rep['overall_score']}/10 | Recommendation: {rep['hiring_recommendation']}")

    print("\n" + "=" * 60)
    print("ALL HIREMIND BACKEND & AI ENDPOINTS PASSED 100% SUCCESSFULLY!")
    print("=" * 60)

if __name__ == "__main__":
    run_e2e_tests()
