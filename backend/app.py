# from fastapi import FastAPI, UploadFile, File
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# import pandas as pd
# import joblib
# import pdfplumber
# import re
# import io

# app = FastAPI()

# # =========================
# # CORS
# # =========================
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # =========================
# # Load ML Model
# # =========================
# model = joblib.load("placement_model.pkl")
# print(type(model))

# # =========================
# # Pydantic Model for Manual Input
# # =========================
# class ManualProfile(BaseModel):
#     branch: str
#     cgpa: float
#     internships: int
#     projects: int
#     certifications: int
#     programming: int
#     aptitude: int
#     communication: int
#     core_subjects: int


# # =========================

# # =========================

# def convert_gpa_to_10(gpa):
#     if gpa <= 4:
#         return round((gpa / 4) * 10, 2)
#     return gpa

# def extract_section(text, keywords):
#     lines = text.split("\n")
#     section = []
#     capture = False

#     for line in lines:
#         l = line.strip().lower()

#         # Start capturing
#         if any(k in l for k in keywords):
#             capture = True
#             continue

#         # Stop at next section (ALL CAPS or heading-like)
#         if capture and (line.isupper() or len(line.split()) <= 2):
#             break

#         if capture:
#             section.append(line)

#     return section

# # def count_entries(section_text):
# #     lines = section_text.split("\n")
# #     lines = [l.strip() for l in lines if l.strip()]
# #     lines = [l for l in lines if len(l.split()) > 2]
# #     return len(lines)
# def count_entries(section_lines):
#     if not isinstance(section_lines, list):
#         return 0   # safety
#     count = 0

#     for line in section_lines:
#         l = line.strip()

#         # Detect bullets, numbered items, or meaningful lines
#         if (
#             l.startswith(("-", "•", "●"))
#             or re.match(r"\d+\.", l)
#             or len(l.split()) > 4
#         ):
#             count += 1

#     return count
# def detect_branch(text):
#     t = text.lower()

#     if "computer science" in t:
#         return "Computer Science Engineering"
#     elif "information technology" in t:
#         return "IT"
#     elif "electronics" in t:
#         return "ECE"
#     elif "mechanical" in t:
#         return "Mechanical"
#     else:
#         return "CSE"

# def rule_based_score(profile):

#     cgpa_score = (profile["cgpa"] / 10) * 25
#     internship_score = min(profile["internships"] * 10, 20)
#     project_score = min(profile["projects"] * 5, 15)
#     certification_score = min(profile["certifications"] * 3, 10)

#     skill_score = (
#         profile["programming"] +
#         profile["aptitude"] +
#         profile["communication"] +
#         profile["core_subjects"]
#     ) * 3

#     total = (
#         cgpa_score +
#         internship_score +
#         project_score +
#         certification_score +
#         skill_score
#     )

#     return round(min(total, 100), 2)


# def ml_probability(profile):
#     internship = 1 if profile["internships"] > 0 else 0

#     branch_map = {
#         "CSE": 0,
#         "IT": 1,
#         "ECE": 2,
#         "Mechanical": 3
#     }

#     branch_encoded = branch_map.get(profile["branch"], 0)

#     input_df = pd.DataFrame([{
#         "cgpa": profile["cgpa"],
#         "etest_p": profile["aptitude"] * 10,
#         "internship": internship,
#         "branch": branch_encoded
#     }])
#     try:
#         prob = model.predict_proba(input_df)[0][1]
#     except:
#         prob = 0.65  # fallback probability
#     return round(prob * 100, 2)

# # =========================
# # ADD THESE FUNCTIONS ABOVE extract_from_resume()
# # =========================

# def extract_section_count(text, keywords):
#     text = text.lower()

#     pattern = r"(" + "|".join(keywords) + r")(.*?)(education|skills|projects|internships|certifications|$)"
#     section = re.search(pattern, text, re.DOTALL)

#     if section:
#         section_text = section.group(2)

#         bullets = re.findall(r"\n[-•●]\s", section_text)
#         count = len(bullets)

#         if count == 0:
#             count = sum(section_text.count(k) for k in keywords)

#         return max(count, 0)

#     return sum(text.count(k) for k in keywords)


# def analyze_profile(profile):

#     strengths = []
#     weaknesses = []
#     improvements = []

#     # CGPA
#     if profile["cgpa"] >= 8:
#         strengths.append("Strong academics")
#     elif profile["cgpa"] >= 6:
#         improvements.append("Improve academic performance")
#     else:
#         weaknesses.append("Low CGPA")

#     # Projects
#     if profile["projects"] >= 5:
#         strengths.append("Good project experience")
#     elif profile["projects"] >= 2:
#         improvements.append("Add more projects")
#     else:
#         weaknesses.append("Very few projects")

#     # Internships
#     if profile["internships"] >= 1:
#         strengths.append("Industry exposure")
#     else:
#         weaknesses.append("No internship experience")

#     # Certifications
#     if profile["certifications"] >= 2:
#         strengths.append("Certified in relevant skills")
#     else:
#         improvements.append("Add certifications")

#     return strengths, weaknesses, improvements


# # =========================
# # UPDATE extract_from_resume()
# # =========================

# def extract_from_resume(file_bytes):
#     text = ""

#     with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
#         for page in pdf.pages:
#             page_text = page.extract_text()
#             if page_text:
#                 text += page_text + " "

#     cgpa_match = re.search(r"(CGPA|GPA)[^\d]*(\d+\.?\d*)", text, re.IGNORECASE)
#     cgpa = float(cgpa_match.group(2)) if cgpa_match else 7.0
#     cgpa = convert_gpa_to_10(cgpa)

#     # 🔥 UPDATED COUNTS
#     project_lines = extract_section_count(text, ["project" , "project experience"])
#     intern_lines = extract_section_count(text, ["intern", "internship", "internships", "experience", "work experience"])
#     cert_lines = extract_section_count(text, ["certification", "certified", "certificate", "certifications", "courses", "achievements"])
#     projects = count_entries(project_lines)
#     internships = count_entries(intern_lines)
#     certifications = count_entries(cert_lines)
#     branch = "CSE"

#     if "computer science" in text.lower():
#         branch = "Computer Science Engineering"
#     elif "information technology" in text.lower():
#         branch = "IT"
#     elif "electronics" in text.lower():
#         branch = "ECE"
#     elif "mechanical" in text.lower():
#         branch = "Mechanical"
#     profile = {
#         "branch": branch,
#         "cgpa": cgpa,
#         "internships": internships,
#         "projects": projects,
#         "certifications": certifications,
#         "programming": 6,
#         "aptitude": 5,
#         "communication": 5,
#         "core_subjects": 5
#     }

#     return profile


# # =========================
# # UPDATE /predict
# # =========================

# @app.post("/predict")
# async def predict(file: UploadFile = File(...)):
#     file_bytes = await file.read()
#     profile = extract_from_resume(file_bytes)

#     readiness = rule_based_score(profile)
#     probability = ml_probability(profile)

#     strengths, weaknesses, improvements = analyze_profile(profile)

#     return {
#         "profile": profile,
#         "readiness_score": readiness,
#         "placement_probability": probability,
#         "strengths": strengths,
#         "weaknesses": weaknesses,
#         "improvements": improvements
#     }


# # =========================
# # UPDATE /predict_manual
# # =========================

# @app.post("/predict_manual")
# async def predict_manual(data: ManualProfile):

#     profile = data.dict()

#     readiness = rule_based_score(profile)
#     probability = ml_probability(profile)

#     strengths, weaknesses, improvements = analyze_profile(profile)

#     return {
#         "profile": profile,
#         "readiness_score": readiness,
#         "placement_probability": probability,
#         "strengths": strengths,
#         "weaknesses": weaknesses,
#         "improvements": improvements
#     }







# # =========================
# # MODULE 2 - RECOMMENDATION API
# # =========================

# import pandas as pd

# # Load dataset
# opportunities_df = pd.read_csv("opportunities_500_dataset.csv")


# def calculate_match(profile, opportunity):
#     # Normalize skills
#     student_skills = []

#     if profile["programming"] >= 6:
#         student_skills.append("python")
#     if profile["aptitude"] >= 6:
#         student_skills.append("dsa")
#     if profile["communication"] >= 6:
#         student_skills.append("communication")
#     if profile["core_subjects"] >= 6:
#         student_skills.append("core")

#     opp_skills = [s.strip().lower() for s in opportunity["skills"].split(",")]

#     # Skill matching score (60%)
#     match_count = sum(1 for s in student_skills if s in opp_skills)
#     skill_score = (match_count / len(opp_skills)) * 60 if opp_skills else 0

#     # CGPA score (20%)
#     cgpa_score = 20 if profile["cgpa"] >= opportunity["min_cgpa"] else 0

#     # Branch score (20%)
#     branch_score = 20 if profile["branch"] == opportunity["branch"] else 0

#     total_score = round(skill_score + cgpa_score + branch_score, 2)

#     return total_score


# @app.post("/recommend")
# async def recommend(profile: dict):

#     results = []

#     for _, row in opportunities_df.iterrows():

#         score = calculate_match(profile, row)

#         results.append({
#             "company": row["company"],
#             "role": row["role"],
#             "location": row["location"],
#             "match_score": score,
#             "skills": row["skills"],
#             "apply_link": row["apply_link"],
#             "logo": row["logo"]
#         })

#     # Sort by match score
#     results = sorted(results, key=lambda x: x["match_score"], reverse=True)

#     return results[:20]   # return top 20





# # =========================
# # MODULE 3 - QUESTION GENERATION
# # =========================

# from typing import List

# # Load question dataset
# questions_df = pd.read_csv("questions_dataset_300.csv")
# import random

# used_questions = set()

# def get_questions(pool, n=15):
#     available = [q for q in pool if q["question"] not in used_questions]

#     if len(available) < n:
#         available = pool.copy()
#     random.shuffle(available)
#     # selected = random.sample(available, min(n, len(available)))
#     selected = available[:n]
#     for q in selected:
#         used_questions.add(q["question"])

#     return selected

# class QuestionRequest(BaseModel):
#     company: str
#     role: str
#     skills: List[str]


# @app.post("/generate-questions")
# async def generate_questions(req: QuestionRequest):

#     filtered = questions_df.copy()

#     # ================= FILTERING =================

#     # Company filter (allow "Any")
#     filtered = filtered[
#         (filtered["company"].str.lower() == req.company.lower()) |
#         (filtered["company"].str.lower() == "any")
#     ]

#     # Role filter
#     filtered = filtered[
#         (filtered["role"].str.lower() == req.role.lower()) |
#         (filtered["role"].str.lower() == "any")
#     ]

#     # ================= SCORING =================

#     def score_question(row):
#         score = 0

#         # Skill match
#         for skill in req.skills:
#             if skill.lower() in str(row["keywords"]).lower():
#                 score += 3

#         # Difficulty balance
#         if row["difficulty"] == "easy":
#             score += 1
#         elif row["difficulty"] == "medium":
#             score += 2
#         else:
#             score += 3

#         return score

#     filtered["score"] = filtered.apply(score_question, axis=1)

#     # ================= SELECTION =================

#     # Pick top questions by type
#     final_questions = []

#     types_needed = {
#         "DSA": 3,
#         "Core": 2,
#         "Skill": 2,
#         "Project": 2,
#         "HR": 2,
#         "Company": 2
#     }

#     for qtype, count in types_needed.items():
#         subset = filtered[filtered["type"] == qtype]
#         subset = subset.sort_values(by="score", ascending=False)
#         # 🔥 Take top 3x candidates for variety
#         top_candidates = subset.head(count * 3)

#         # 🔥 Shuffle BEFORE selecting
#         top_candidates = top_candidates.sample(frac=1)

#         selected = top_candidates.head(count)
        
#         final_questions.append(selected)

#     final_df = pd.concat(final_questions)

#     # Shuffle for randomness
#     final_df = final_df.sample(frac=1)

#     # ================= RESPONSE =================

#     questions = final_df.to_dict(orient="records")
#     selected_questions = get_questions(questions, 15)
#     return {
#         "total_questions": len(selected_questions),
#         "questions": selected_questions
#     } 
# # =========================
# # MODULE 3 - ANSWER EVALUATION
# # =========================

# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.metrics.pairwise import cosine_similarity


# class AnswerItem(BaseModel):
#     question: str
#     user_answer: str
#     expected_answer: str
#     keywords: str
#     type: str


# class EvaluationRequest(BaseModel):
#     answers: List[AnswerItem]


# @app.post("/evaluate-answers")
# async def evaluate_answers(req: EvaluationRequest):

#     results = []
#     total_score = 0
#     improvements = []
#     strengths = []
#     weaknesses = []

#     for item in req.answers:

#         user = item.user_answer.lower()
#         expected = item.expected_answer.lower()

#         # ================= TF-IDF SIMILARITY =================
#         vectorizer = TfidfVectorizer()

#         tfidf = vectorizer.fit_transform([user, expected])
#         similarity = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]

#         sim_score = similarity * 40  # 40% weight

#         # ================= KEYWORD MATCH =================
#         keyword_list = [k.strip() for k in item.keywords.split(",")]

#         match_count = 0

#         for k in keyword_list:
#             if k in user:
#                 match_count += 1
#             elif k == "array" and ("list" in user or "elements" in user):
#                 match_count += 1
#         keyword_score = (match_count / len(keyword_list)) * 40 if keyword_list else 0

#         # ================= LENGTH CHECK =================
#         length_score = min(len(user.split()) / 20, 1) * 20  # 20% weight

#         # ================= FINAL =================
#         final = sim_score + keyword_score + length_score
#         final = round(min(final, 100), 2)

#         total_score += final

#         # ================= ANALYSIS =================
#         if final >= 70:
#             strengths.append(item.type)

#         elif final >= 50:
#         # neither strong nor weak → improvement zone
#             improvements.append(item.type)

#         else:
#             weaknesses.append(item.type)

#         results.append({
#             "question": item.question,
#             "score": final,
#             "similarity": round(similarity, 2)
#         })

#     avg_score = round(total_score / len(req.answers), 2) if req.answers else 0

#     # ================= UNIQUE STRENGTHS =================
#     strengths = list(set(strengths))
#     weaknesses = list(set(weaknesses))
#     print(final, item.type)
    

#     return {
#     "overall_score": avg_score,
#     "results": results,
#     "strengths": list(set(strengths)),
#     "improvements": list(set(improvements)),
#     "weaknesses": list(set(weaknesses))
# }

# # # =========================
# # # MODULE 3 - FINAL RESULT + ROADMAP
# # # =========================

# # class FinalRequest(BaseModel):
# #     overall_score: float
# #     strengths: List[str]
# #     improvements: List[str]
# #     weaknesses: List[str]


# # @app.post("/final-result")
# # async def final_result(req: FinalRequest):

# #     score = req.overall_score

# #     # ================= STATUS =================
# #     if score >= 75:
# #         status = "Ready"
# #     elif score >= 50:
# #         status = "Needs Improvement"
# #     else:
# #         status = "Not Ready"

# #     # ================= ROADMAP =================
# #     roadmap = []

# #     weak_areas = list(set(req.weaknesses + req.improvements))

# #     for area in weak_areas:

# #         if area == "DSA":

# #             if score < 50:
# #                 roadmap.append("Start with basic DSA (arrays, strings)")
# #                 roadmap.append("Solve 1 easy problem daily")
# #             elif score < 70:
# #                 roadmap.append("Practice medium DSA problems")
# #                 roadmap.append("Focus on patterns (sliding window, recursion)")
# #             else:
# #                 roadmap.append("Solve advanced problems (graphs, DP)")
# #                 roadmap.append("Mock interviews for DSA")

# #         elif area == "Core":

# #             if score < 50:
# #                 roadmap.append("Revise OS, DBMS fundamentals")
# #             else:
# #                 roadmap.append("Practice core interview questions")
# #                 roadmap.append("Prepare short revision notes")

# #         elif area == "Skill":

# #             roadmap.append("Improve coding skills with projects")
# #             if score < 60:
# #                 roadmap.append("Focus on fundamentals of language")
# #             else:
# #                 roadmap.append("Build advanced projects")

# #         elif area == "Project":

# #             roadmap.append("Improve explanation of your projects")
# #             roadmap.append("Focus on architecture and scalability")

# #         elif area == "HR":

# #             roadmap.append("Practice common HR questions")
# #             if score < 60:
# #                 roadmap.append("Work on communication clarity")
# #             else:
# #                 roadmap.append("Refine storytelling answers")

# #         elif area == "Company":

# #             roadmap.append("Study company interview pattern")
# #             roadmap.append("Practice previous interview questions")
# #     # ================= FINAL RESPONSE =================
# #     # ================= SECTION SCORES =================
# #     section_scores = []

# #     for sec in ["DSA", "Core", "Skill", "Project", "HR"]:
# #         if sec in req.strengths:
# #             score = 80
# #         elif sec in req.improvements:
# #             score = 60
# #         elif sec in req.weaknesses:
# #             score = 40
# #         else:
# #             score = 50

# #         section_scores.append({
# #             "name": sec,
# #             "score": score
# #         })
# #     return {
# #         "final_score": score,
# #         "status": status,
# #         "strengths": req.strengths,
# #         "improvements": req.improvements,
# #         "weaknesses": req.weaknesses,
# #         "roadmap": roadmap,
# #         "section_scores": section_scores
# #     }

# # =========================
# # MODULE 3 - FINAL RESULT + ROADMAP
# # =========================

# class FinalRequest(BaseModel):
#     overall_score: float
#     strengths: List[str]
#     improvements: List[str]
#     weaknesses: List[str]


# @app.post("/final-result")
# async def final_result(req: FinalRequest):

#     overall_score = req.overall_score   # ✅ FIXED

#     # ================= STATUS =================
#     if overall_score >= 75:
#         status = "Ready"
#     elif overall_score >= 50:
#         status = "Needs Improvement"
#     else:
#         status = "Not Ready"

#     # ================= ROADMAP =================
#     roadmap = []

#     weak_areas = list(set(req.weaknesses + req.improvements))

#     for area in weak_areas:

#         if area == "DSA":
#             if overall_score < 50:
#                 roadmap.append("Start with basic DSA (arrays, strings)")
#                 roadmap.append("Solve 1 easy problem daily")
#             elif overall_score < 70:
#                 roadmap.append("Practice medium DSA problems")
#                 roadmap.append("Focus on patterns (sliding window, recursion)")
#             else:
#                 roadmap.append("Solve advanced problems (graphs, DP)")
#                 roadmap.append("Mock interviews for DSA")

#         elif area == "Core":
#             if overall_score < 50:
#                 roadmap.append("Revise OS, DBMS fundamentals")
#             else:
#                 roadmap.append("Practice core interview questions")
#                 roadmap.append("Prepare short revision notes")

#         elif area == "Skill":
#             roadmap.append("Improve coding skills with projects")
#             if overall_score < 60:
#                 roadmap.append("Focus on fundamentals of language")
#             else:
#                 roadmap.append("Build advanced projects")

#         elif area == "Project":
#             roadmap.append("Improve explanation of your projects")
#             roadmap.append("Focus on architecture and scalability")

#         elif area == "HR":
#             roadmap.append("Practice common HR questions")
#             if overall_score < 60:
#                 roadmap.append("Work on communication clarity")
#             else:
#                 roadmap.append("Refine storytelling answers")

#         elif area == "Company":
#             roadmap.append("Study company interview pattern")
#             roadmap.append("Practice previous interview questions")

#     # ================= SECTION SCORES =================
#     section_scores = []

#     for sec in ["DSA", "Core", "Skill", "Project", "HR"]:
#         if sec in req.strengths:
#             sec_score = 80
#         elif sec in req.improvements:
#             sec_score = 60
#         elif sec in req.weaknesses:
#             sec_score = 40
#         else:
#             sec_score = 50

#         section_scores.append({
#             "name": sec,
#             "score": sec_score
#         })

#     return {
#         "final_score": overall_score,   # ✅ FIXED
#         "status": status,
#         "strengths": req.strengths,
#         "improvements": req.improvements,
#         "weaknesses": req.weaknesses,
#         "roadmap": roadmap,
#         "section_scores": section_scores
#     }








from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import pdfplumber
import re
import io

app = FastAPI()

# =========================
# CORS
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# Load ML Model
# =========================
model = joblib.load("placement_model.pkl")
print(type(model))

# =========================
# Pydantic Model for Manual Input
# =========================
class ManualProfile(BaseModel):
    branch: str
    cgpa: float
    internships: int
    projects: int
    certifications: int
    programming: int
    aptitude: int
    communication: int
    core_subjects: int


# =========================

# =========================

def convert_gpa_to_10(gpa):
    if gpa <= 4:
        return round((gpa / 4) * 10, 2)
    return gpa


def rule_based_score(profile):

    cgpa_score = (profile["cgpa"] / 10) * 25
    internship_score = min(profile["internships"] * 10, 20)
    project_score = min(profile["projects"] * 5, 15)
    certification_score = min(profile["certifications"] * 3, 10)

    skill_score = (
        profile["programming"] +
        profile["aptitude"] +
        profile["communication"] +
        profile["core_subjects"]
    ) * 3

    total = (
        cgpa_score +
        internship_score +
        project_score +
        certification_score +
        skill_score
    )

    return round(min(total, 100), 2)


def ml_probability(profile):
    internship = 1 if profile["internships"] > 0 else 0

    branch_map = {
        "CSE": 0,
        "IT": 1,
        "ECE": 2,
        "Mechanical": 3
    }

    branch_encoded = branch_map.get(profile["branch"], 0)

    input_df = pd.DataFrame([{
        "cgpa": profile["cgpa"],
        "etest_p": profile["aptitude"] * 10,
        "internship": internship,
        "branch": branch_encoded
    }])
    try:
        prob = model.predict_proba(input_df)[0][1]
    except:
        prob = 0.65  # fallback probability
    return round(prob * 100, 2)

# =========================
# ADD THESE FUNCTIONS ABOVE extract_from_resume()
# =========================

def extract_section_count(text, keywords):
    text = text.lower()

    pattern = r"(" + "|".join(keywords) + r")(.*?)(education|skills|projects|internships|certifications|$)"
    section = re.search(pattern, text, re.DOTALL)

    if section:
        section_text = section.group(2)

        bullets = re.findall(r"\n[-•●]\s", section_text)
        count = len(bullets)

        if count == 0:
            count = sum(section_text.count(k) for k in keywords)

        return max(count, 0)

    return sum(text.count(k) for k in keywords)


def analyze_profile(profile):

    strengths = []
    weaknesses = []
    improvements = []

    # CGPA
    if profile["cgpa"] >= 8:
        strengths.append("Strong academics")
    elif profile["cgpa"] >= 6:
        improvements.append("Improve academic performance")
    else:
        weaknesses.append("Low CGPA")

    # Projects
    if profile["projects"] >= 5:
        strengths.append("Good project experience")
    elif profile["projects"] >= 2:
        improvements.append("Add more projects")
    else:
        weaknesses.append("Very few projects")

    # Internships
    if profile["internships"] >= 1:
        strengths.append("Industry exposure")
    else:
        weaknesses.append("No internship experience")

    # Certifications
    if profile["certifications"] >= 2:
        strengths.append("Certified in relevant skills")
    else:
        improvements.append("Add certifications")

    return strengths, weaknesses, improvements


# =========================
# UPDATE extract_from_resume()
# =========================

def extract_from_resume(file_bytes):
    text = ""

    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + " "

    cgpa_match = re.search(r"(CGPA|GPA)[^\d]*(\d+\.?\d*)", text, re.IGNORECASE)
    cgpa = float(cgpa_match.group(2)) if cgpa_match else 7.0
    cgpa = convert_gpa_to_10(cgpa)

    # 🔥 UPDATED COUNTS
    projects = extract_section_count(text, ["project", "projects", "project experience"])
    internships = extract_section_count(text, ["intern", "internship", "internships", "experience", "work experience"])
    certifications = extract_section_count(text, ["certification", "certified", "certificate", "certifications", "courses", "achievements"])

    profile = {
        "branch": "CSE",
        "cgpa": cgpa,
        "internships": internships,
        "projects": projects,
        "certifications": certifications,
        "programming": 6,
        "aptitude": 5,
        "communication": 5,
        "core_subjects": 5
    }

    return profile


# =========================
# UPDATE /predict
# =========================

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    file_bytes = await file.read()
    profile = extract_from_resume(file_bytes)

    readiness = rule_based_score(profile)
    probability = ml_probability(profile)

    strengths, weaknesses, improvements = analyze_profile(profile)

    return {
        "profile": profile,
        "readiness_score": readiness,
        "placement_probability": probability,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "improvements": improvements
    }


# =========================
# UPDATE /predict_manual
# =========================

@app.post("/predict_manual")
async def predict_manual(data: ManualProfile):

    profile = data.dict()

    readiness = rule_based_score(profile)
    probability = ml_probability(profile)

    strengths, weaknesses, improvements = analyze_profile(profile)

    return {
        "profile": profile,
        "readiness_score": readiness,
        "placement_probability": probability,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "improvements": improvements
    }
# def extract_from_resume(file_bytes):
#     text = ""

#     with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
#         for page in pdf.pages:
#             page_text = page.extract_text()
#             if page_text:
#                 text += page_text + " "

#     cgpa_match = re.search(r"(CGPA|GPA)[^\d]*(\d+\.?\d*)", text, re.IGNORECASE)
#     cgpa = float(cgpa_match.group(2)) if cgpa_match else 7.0
#     cgpa = convert_gpa_to_10(cgpa)

#     profile = {
#         "branch": "CSE",
#         "cgpa": cgpa,
#         "internships": text.lower().count("intern"),
#         "projects": text.lower().count("project"),
#         "certifications": text.lower().count("certificat"),
#         "programming": 6,
#         "aptitude": 5,
#         "communication": 5,
#         "core_subjects": 5
#     }

#     return profile


# # =========================
# # Resume Endpoint
# # =========================
# @app.post("/predict")
# async def predict(file: UploadFile = File(...)):
#     file_bytes = await file.read()
#     profile = extract_from_resume(file_bytes)

#     readiness = rule_based_score(profile)
#     probability = ml_probability(profile)

#     return {
#         "profile": profile,
#         "readiness_score": readiness,
#         "placement_probability": probability
#     }


# # =========================
# # Manual Endpoint
# # =========================
# @app.post("/predict_manual")
# async def predict_manual(data: ManualProfile):

#     profile = data.dict()

#     readiness = rule_based_score(profile)
#     probability = ml_probability(profile)

#     return {
#         "profile": profile,
#         "readiness_score": readiness,
#         "placement_probability": probability
#     }









# =========================
# MODULE 2 - RECOMMENDATION API
# =========================

import pandas as pd

# Load dataset
opportunities_df = pd.read_csv("opportunities_500_dataset.csv")


def calculate_match(profile, opportunity):
    # Normalize skills
    student_skills = []

    if profile["programming"] >= 6:
        student_skills.append("python")
    if profile["aptitude"] >= 6:
        student_skills.append("dsa")
    if profile["communication"] >= 6:
        student_skills.append("communication")
    if profile["core_subjects"] >= 6:
        student_skills.append("core")

    opp_skills = [s.strip().lower() for s in opportunity["skills"].split(",")]

    # Skill matching score (60%)
    match_count = sum(1 for s in student_skills if s in opp_skills)
    skill_score = (match_count / len(opp_skills)) * 60 if opp_skills else 0

    # CGPA score (20%)
    cgpa_score = 20 if profile["cgpa"] >= opportunity["min_cgpa"] else 0

    # Branch score (20%)
    branch_score = 20 if profile["branch"] == opportunity["branch"] else 0

    total_score = round(skill_score + cgpa_score + branch_score, 2)

    return total_score


@app.post("/recommend")
async def recommend(profile: dict):

    results = []

    for _, row in opportunities_df.iterrows():

        score = calculate_match(profile, row)

        results.append({
            "company": row["company"],
            "role": row["role"],
            "location": row["location"],
            "match_score": score,
            "skills": row["skills"],
            "apply_link": row["apply_link"],
            "logo": row["logo"]
        })

    # Sort by match score
    results = sorted(results, key=lambda x: x["match_score"], reverse=True)

    return results[:20]   # return top 20





# =========================
# MODULE 3 - QUESTION GENERATION
# =========================

from typing import List

# Load question dataset
questions_df = pd.read_csv("questions_dataset_300.csv")
import random

used_questions = set()

def get_questions(pool, n=15):
    available = [q for q in pool if q["question"] not in used_questions]

    if len(available) < n:
        available = pool.copy()
    random.shuffle(available)
    # selected = random.sample(available, min(n, len(available)))
    selected = available[:n]
    for q in selected:
        used_questions.add(q["question"])

    return selected

class QuestionRequest(BaseModel):
    company: str
    role: str
    skills: List[str]


@app.post("/generate-questions")
async def generate_questions(req: QuestionRequest):

    filtered = questions_df.copy()

    # ================= FILTERING =================

    # Company filter (allow "Any")
    filtered = filtered[
        (filtered["company"].str.lower() == req.company.lower()) |
        (filtered["company"].str.lower() == "any")
    ]

    # Role filter
    filtered = filtered[
        (filtered["role"].str.lower() == req.role.lower()) |
        (filtered["role"].str.lower() == "any")
    ]

    # ================= SCORING =================

    def score_question(row):
        score = 0

        # Skill match
        for skill in req.skills:
            if skill.lower() in str(row["keywords"]).lower():
                score += 3

        # Difficulty balance
        if row["difficulty"] == "easy":
            score += 1
        elif row["difficulty"] == "medium":
            score += 2
        else:
            score += 3

        return score

    filtered["score"] = filtered.apply(score_question, axis=1)

    # ================= SELECTION =================

    # Pick top questions by type
    final_questions = []

    types_needed = {
        "DSA": 3,
        "Core": 2,
        "Skill": 2,
        "Project": 2,
        "HR": 2,
        "Company": 2
    }

    for qtype, count in types_needed.items():
        subset = filtered[filtered["type"] == qtype]
        subset = subset.sort_values(by="score", ascending=False)
        # 🔥 Take top 3x candidates for variety
        top_candidates = subset.head(count * 3)

        # 🔥 Shuffle BEFORE selecting
        top_candidates = top_candidates.sample(frac=1)

        selected = top_candidates.head(count)
        
        final_questions.append(selected)

    final_df = pd.concat(final_questions)

    # Shuffle for randomness
    final_df = final_df.sample(frac=1)

    # ================= RESPONSE =================

    questions = final_df.to_dict(orient="records")
    selected_questions = get_questions(questions, 15)
    return {
        "total_questions": len(selected_questions),
        "questions": selected_questions
    } 
# =========================
# MODULE 3 - ANSWER EVALUATION
# =========================

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


class AnswerItem(BaseModel):
    question: str
    user_answer: str
    expected_answer: str
    keywords: str
    type: str


class EvaluationRequest(BaseModel):
    answers: List[AnswerItem]


@app.post("/evaluate-answers")
async def evaluate_answers(req: EvaluationRequest):

    results = []
    total_score = 0
    improvements = []
    strengths = []
    weaknesses = []

    for item in req.answers:

        user = item.user_answer.lower()
        expected = item.expected_answer.lower()

        # ================= TF-IDF SIMILARITY =================
        vectorizer = TfidfVectorizer()

        tfidf = vectorizer.fit_transform([user, expected])
        similarity = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]

        sim_score = similarity * 40  # 40% weight

        # ================= KEYWORD MATCH =================
        keyword_list = [k.strip() for k in item.keywords.split(",")]

        match_count = 0

        for k in keyword_list:
            if k in user:
                match_count += 1
            elif k == "array" and ("list" in user or "elements" in user):
                match_count += 1
        keyword_score = (match_count / len(keyword_list)) * 40 if keyword_list else 0

        # ================= LENGTH CHECK =================
        length_score = min(len(user.split()) / 20, 1) * 20  # 20% weight

        # ================= FINAL =================
        final = sim_score + keyword_score + length_score
        final = round(min(final, 100), 2)

        total_score += final

        # ================= ANALYSIS =================
        if final >= 70:
            strengths.append(item.type)

        elif final >= 50:
        # neither strong nor weak → improvement zone
            improvements.append(item.type)

        else:
            weaknesses.append(item.type)

        results.append({
            "question": item.question,
            "score": final,
            "similarity": round(similarity, 2)
        })

    avg_score = round(total_score / len(req.answers), 2) if req.answers else 0

    # ================= UNIQUE STRENGTHS =================
    strengths = list(set(strengths))
    weaknesses = list(set(weaknesses))
    print(final, item.type)
    

    return {
    "overall_score": avg_score,
    "results": results,
    "strengths": list(set(strengths)),
    "improvements": list(set(improvements)),
    "weaknesses": list(set(weaknesses))
}

# # =========================
# # MODULE 3 - FINAL RESULT + ROADMAP
# # =========================

# class FinalRequest(BaseModel):
#     overall_score: float
#     strengths: List[str]
#     improvements: List[str]
#     weaknesses: List[str]


# @app.post("/final-result")
# async def final_result(req: FinalRequest):

#     score = req.overall_score

#     # ================= STATUS =================
#     if score >= 75:
#         status = "Ready"
#     elif score >= 50:
#         status = "Needs Improvement"
#     else:
#         status = "Not Ready"

#     # ================= ROADMAP =================
#     roadmap = []

#     weak_areas = list(set(req.weaknesses + req.improvements))

#     for area in weak_areas:

#         if area == "DSA":

#             if score < 50:
#                 roadmap.append("Start with basic DSA (arrays, strings)")
#                 roadmap.append("Solve 1 easy problem daily")
#             elif score < 70:
#                 roadmap.append("Practice medium DSA problems")
#                 roadmap.append("Focus on patterns (sliding window, recursion)")
#             else:
#                 roadmap.append("Solve advanced problems (graphs, DP)")
#                 roadmap.append("Mock interviews for DSA")

#         elif area == "Core":

#             if score < 50:
#                 roadmap.append("Revise OS, DBMS fundamentals")
#             else:
#                 roadmap.append("Practice core interview questions")
#                 roadmap.append("Prepare short revision notes")

#         elif area == "Skill":

#             roadmap.append("Improve coding skills with projects")
#             if score < 60:
#                 roadmap.append("Focus on fundamentals of language")
#             else:
#                 roadmap.append("Build advanced projects")

#         elif area == "Project":

#             roadmap.append("Improve explanation of your projects")
#             roadmap.append("Focus on architecture and scalability")

#         elif area == "HR":

#             roadmap.append("Practice common HR questions")
#             if score < 60:
#                 roadmap.append("Work on communication clarity")
#             else:
#                 roadmap.append("Refine storytelling answers")

#         elif area == "Company":

#             roadmap.append("Study company interview pattern")
#             roadmap.append("Practice previous interview questions")
#     # ================= FINAL RESPONSE =================
#     # ================= SECTION SCORES =================
#     section_scores = []

#     for sec in ["DSA", "Core", "Skill", "Project", "HR"]:
#         if sec in req.strengths:
#             score = 80
#         elif sec in req.improvements:
#             score = 60
#         elif sec in req.weaknesses:
#             score = 40
#         else:
#             score = 50

#         section_scores.append({
#             "name": sec,
#             "score": score
#         })
#     return {
#         "final_score": score,
#         "status": status,
#         "strengths": req.strengths,
#         "improvements": req.improvements,
#         "weaknesses": req.weaknesses,
#         "roadmap": roadmap,
#         "section_scores": section_scores
#     }

# =========================
# MODULE 3 - FINAL RESULT + ROADMAP
# =========================

class FinalRequest(BaseModel):
    overall_score: float
    strengths: List[str]
    improvements: List[str]
    weaknesses: List[str]


@app.post("/final-result")
async def final_result(req: FinalRequest):

    overall_score = req.overall_score   # ✅ FIXED

    # ================= STATUS =================
    if overall_score >= 75:
        status = "Ready"
    elif overall_score >= 50:
        status = "Needs Improvement"
    else:
        status = "Not Ready"

    # ================= ROADMAP =================
    roadmap = []

    weak_areas = list(set(req.weaknesses + req.improvements))

    for area in weak_areas:

        if area == "DSA":
            if overall_score < 50:
                roadmap.append("Start with basic DSA (arrays, strings)")
                roadmap.append("Solve 1 easy problem daily")
            elif overall_score < 70:
                roadmap.append("Practice medium DSA problems")
                roadmap.append("Focus on patterns (sliding window, recursion)")
            else:
                roadmap.append("Solve advanced problems (graphs, DP)")
                roadmap.append("Mock interviews for DSA")

        elif area == "Core":
            if overall_score < 50:
                roadmap.append("Revise OS, DBMS fundamentals")
            else:
                roadmap.append("Practice core interview questions")
                roadmap.append("Prepare short revision notes")

        elif area == "Skill":
            roadmap.append("Improve coding skills with projects")
            if overall_score < 60:
                roadmap.append("Focus on fundamentals of language")
            else:
                roadmap.append("Build advanced projects")

        elif area == "Project":
            roadmap.append("Improve explanation of your projects")
            roadmap.append("Focus on architecture and scalability")

        elif area == "HR":
            roadmap.append("Practice common HR questions")
            if overall_score < 60:
                roadmap.append("Work on communication clarity")
            else:
                roadmap.append("Refine storytelling answers")

        elif area == "Company":
            roadmap.append("Study company interview pattern")
            roadmap.append("Practice previous interview questions")

    # ================= SECTION SCORES =================
    section_scores = []

    for sec in ["DSA", "Core", "Skill", "Project", "HR"]:
        if sec in req.strengths:
            sec_score = 80
        elif sec in req.improvements:
            sec_score = 60
        elif sec in req.weaknesses:
            sec_score = 40
        else:
            sec_score = 50
        sec_score = max(0, min(sec_score, 100))
        section_scores.append({
            "name": sec,
            "score": sec_score
        })

    return {
        "final_score": overall_score,   # ✅ FIXED
        "status": status,
        "strengths": req.strengths,
        "improvements": req.improvements,
        "weaknesses": req.weaknesses,
        "roadmap": roadmap,
        "section_scores": section_scores
    }