# from fastapi import FastAPI, UploadFile, File
# from fastapi.middleware.cors import CORSMiddleware
# import pandas as pd
# import joblib
# import pdfplumber
# import re
# import io

# app = FastAPI()

# # =========================
# # Allow React Frontend Access
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

# # =========================
# # Helper Functions
# # =========================

# def convert_gpa_to_10(gpa):
#     if gpa <= 4:
#         return round((gpa / 4) * 10, 2)
#     return gpa

# def rule_based_score(profile):
#     score = (
#         profile["cgpa"] * 4 +
#         profile["internships"] * 5 +
#         profile["projects"] * 4 +
#         profile["certifications"] * 3 +
#         profile["programming"] * 2 +
#         profile["aptitude"] * 1.5 +
#         profile["communication"] * 1.5 +
#         profile["core_subjects"] * 2
#     )
#     return min(round(score / 5, 2), 100)

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

#     prob = model.predict_proba(input_df)[0][1]
#     return round(prob * 100, 2)

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
# # API Endpoint
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
# # Allow React Frontend Access
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

# # =========================
# # Helper Functions
# # =========================

# def convert_gpa_to_10(gpa):
#     if gpa <= 4:
#         return round((gpa / 4) * 10, 2)
#     return gpa

# def rule_based_score(profile):
#     score = (
#         profile["cgpa"] * 4 +
#         profile["internships"] * 5 +
#         profile["projects"] * 4 +
#         profile["certifications"] * 3 +
#         profile["programming"] * 2 +
#         profile["aptitude"] * 1.5 +
#         profile["communication"] * 1.5 +
#         profile["core_subjects"] * 2
#     )
#     return min(round(score / 5, 2), 100)

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

#     prob = model.predict_proba(input_df)[0][1]
#     return round(prob * 100, 2)

# def build_response(profile):
#     readiness = rule_based_score(profile)
#     probability = ml_probability(profile)

#     if probability >= 75:
#         status = "Likely Placed"
#     elif probability >= 50:
#         status = "Moderate Chance"
#     else:
#         status = "Needs Improvement"

#     return {
#         "profile": profile,
#         "result": {
#             "readiness": readiness,
#             "probability": probability,
#             "status": status
#         }
#     }

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
# # Manual Input Model
# # =========================

# class ManualInput(BaseModel):
#     profile: dict
#     skills: dict

# # =========================
# # Resume Upload Endpoint
# # =========================

# @app.post("/predict")
# async def predict(file: UploadFile = File(...)):

#     file_bytes = await file.read()
#     profile = extract_from_resume(file_bytes)

#     return build_response(profile)

# # =========================
# # Manual Input Endpoint
# # =========================

# @app.post("/predict_manual")
# async def predict_manual(data: ManualInput):

#     profile = data.profile
#     skills = data.skills

#     # Merge skills into profile format expected by scoring functions
#     profile["programming"] = skills["programming"]
#     profile["aptitude"] = skills["aptitude"]
#     profile["communication"] = skills["communication"]
#     profile["core_subjects"] = skills["core"]

#     return build_response(profile)


















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
# Helper Functions
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

    prob = model.predict_proba(input_df)[0][1]
    return round(prob * 100, 2)


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

    profile = {
        "branch": "CSE",
        "cgpa": cgpa,
        "internships": text.lower().count("intern"),
        "projects": text.lower().count("project"),
        "certifications": text.lower().count("certificat"),
        "programming": 6,
        "aptitude": 5,
        "communication": 5,
        "core_subjects": 5
    }

    return profile


# =========================
# Resume Endpoint
# =========================
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    file_bytes = await file.read()
    profile = extract_from_resume(file_bytes)

    readiness = rule_based_score(profile)
    probability = ml_probability(profile)

    return {
        "profile": profile,
        "readiness_score": readiness,
        "placement_probability": probability
    }


# =========================
# Manual Endpoint
# =========================
@app.post("/predict_manual")
async def predict_manual(data: ManualProfile):

    profile = data.dict()

    readiness = rule_based_score(profile)
    probability = ml_probability(profile)

    return {
        "profile": profile,
        "readiness_score": readiness,
        "placement_probability": probability
    }









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