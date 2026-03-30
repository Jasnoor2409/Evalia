# import streamlit as st
# import pdfplumber
# import re
# import joblib
# import pandas as pd

# st.set_page_config(page_title="Evalia", layout="wide")

# st.title("AI-Based Placement & Opportunity Intelligence Platform")
# st.subheader("Component 1: Smart Placement Tracker & Probability Dashboard")

# # ==================================================
# # LOAD ML MODEL
# # ==================================================
# @st.cache_resource
# def load_model():
#     return joblib.load("placement_model.pkl")

# ml_model = load_model()

# # ==================================================
# # RULE-BASED READINESS
# # ==================================================
# def calculate_readiness(profile):
#     cgpa = profile["cgpa"]

#     if cgpa <= 4:
#         cgpa = (cgpa / 4.0) * 10

#     skill_score = (
#         profile["programming"] * 0.30 +
#         profile["core"] * 0.25 +
#         profile["aptitude"] * 0.20 +
#         profile["communication"] * 0.25
#     )

#     readiness = (
#         (skill_score * 5) +
#         (cgpa * 2.5) +
#         (profile["projects"] * 2) +
#         (profile["internships"] * 1.5) +
#         profile["certifications"]
#     )

#     return round(min(readiness, 100), 2)


# # ==================================================
# # ML PROBABILITY
# # ==================================================
# def ml_probability(profile):
#     cgpa = profile["cgpa"]
#     if cgpa <= 4:
#         cgpa = (cgpa / 4.0) * 10

#     internship = 1 if profile["internships"] > 0 else 0

#     branch_map = {
#         "CSE": 0,
#         "IT": 1,
#         "ECE": 2,
#         "Mechanical": 3
#     }

#     branch_encoded = branch_map.get(profile["branch"], 0)

#     X = pd.DataFrame([{
#         "cgpa": cgpa,
#         "etest_p": profile["aptitude"] * 10,
#         "internship": internship,
#         "branch": branch_encoded
#     }])

#     probability = ml_model.predict_proba(X)[0][1]
#     return round(probability * 100, 2)


# # ==================================================
# # UI
# # ==================================================
# left, right = st.columns([1, 2])

# with left:
#     st.markdown("### Student Input")

#     input_mode = st.radio(
#         "Input Method",
#         ["Manual Input", "Resume Upload"],
#         index=0
#     )

#     profile = None

#     # ---------------- Manual ----------------
#     if input_mode == "Manual Input":
#         branch = st.selectbox("Branch", ["CSE", "IT", "ECE", "Mechanical"])
#         cgpa = st.number_input("CGPA / GPA", 0.0, 10.0, 7.5)

#         internships = st.number_input("Internships", 0, 5, 0)
#         projects = st.number_input("Projects", 0, 10, 2)
#         certifications = st.number_input("Certifications", 0, 10, 0)

#         programming = st.slider("Programming Skill", 0, 10, 6)
#         core = st.slider("Core Subject Knowledge", 0, 10, 5)
#         aptitude = st.slider("Aptitude Skill", 0, 10, 5)
#         communication = st.slider("Communication Skill", 0, 10, 5)

#         profile = {
#             "branch": branch,
#             "cgpa": cgpa,
#             "internships": internships,
#             "projects": projects,
#             "certifications": certifications,
#             "programming": programming,
#             "core": core,
#             "aptitude": aptitude,
#             "communication": communication
#         }

#     # ---------------- Resume Upload ----------------
#     else:
#         uploaded_file = st.file_uploader("Upload Resume (PDF only)", type=["pdf"])

#         if uploaded_file:
#             text = ""

#             with pdfplumber.open(uploaded_file) as pdf:
#                 for page in pdf.pages:
#                     page_text = page.extract_text()
#                     if page_text:
#                         text += page_text.lower()

#             text = re.sub(r"\s+", " ", text)

#             if "computer" in text or "cse" in text:
#                 branch = "CSE"
#             elif "electronics" in text:
#                 branch = "ECE"
#             elif "mechanical" in text:
#                 branch = "Mechanical"
#             else:
#                 branch = "IT"

#             cgpa_match = re.findall(r"\b\d\.\d{1,2}\b", text)
#             cgpa = float(max(cgpa_match)) if cgpa_match else 7.0

#             internships = text.count("intern")
#             projects = text.count("project")
#             certifications = text.count("certificat")

#             programming = min(sum(k in text for k in ["python","java","c++","sql","javascript"]), 10)
#             core = min(sum(k in text for k in ["dsa","algorithm","dbms","operating system"]), 10)

#             profile = {
#                 "branch": branch,
#                 "cgpa": cgpa,
#                 "internships": internships,
#                 "projects": projects,
#                 "certifications": certifications,
#                 "programming": programming,
#                 "core": core,
#                 "aptitude": 5,
#                 "communication": 5
#             }

#             st.markdown("#### 📋 Extracted Profile")
#             st.json(profile)

#     analyze = st.button("Analyze Placement Readiness")

# with right:
#     st.markdown("### Placement Insights")

#     if analyze and profile:
#         readiness = calculate_readiness(profile)
#         ml_prob = ml_probability(profile)

#         st.metric("Readiness Score (Rule-Based)", f"{readiness} / 100")
#         st.metric("Placement Probability (ML Model)", f"{ml_prob} %")

#         if readiness >= 70:
#             st.success("Highly Likely Placed")
#         elif readiness >= 55:
#             st.info("Moderately Placement Ready")
#         else:
#             st.warning("Needs Improvement")























import streamlit as st
import pandas as pd
import joblib
import pdfplumber
import re

# ===================================
# LOAD MODEL
# ===================================

@st.cache_resource
def load_model():
    return joblib.load("placement_model.pkl")

model = load_model()

# ===================================
# HELPER FUNCTIONS
# ===================================

def convert_gpa_to_10(gpa):
    if gpa <= 4:
        return round((gpa / 4) * 10, 2)
    return gpa

def rule_based_score(profile):
    score = (
        profile["cgpa"] * 4 +
        profile["internships"] * 5 +
        profile["projects"] * 4 +
        profile["certifications"] * 3 +
        profile["programming"] * 2 +
        profile["aptitude"] * 1.5 +
        profile["communication"] * 1.5 +
        profile["core_subjects"] * 2
    )
    return min(round(score / 5, 2), 100)

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

def extract_from_resume(file):
    text = ""
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + " "

    cgpa_match = re.search(r"(CGPA|GPA)[^\d]*(\d+\.?\d*)", text, re.IGNORECASE)
    cgpa = float(cgpa_match.group(2)) if cgpa_match else 7.0
    cgpa = convert_gpa_to_10(cgpa)

    return {
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

# ===================================
# BASIC STREAMLIT UI (NO STYLING)
# ===================================

st.title("Placement Readiness Analyzer")

input_method = st.radio("Input Method", ["Manual Input", "Resume Upload"])

if input_method == "Manual Input":

    branch = st.selectbox("Branch", ["CSE", "IT", "ECE", "Mechanical"])
    cgpa = convert_gpa_to_10(st.slider("CGPA", 0.0, 10.0, 7.0))
    internships = st.number_input("Internships", 0, 10, 0)
    projects = st.number_input("Projects", 0, 10, 0)
    certifications = st.number_input("Certifications", 0, 10, 0)
    programming = st.slider("Programming", 0, 10, 6)
    aptitude = st.slider("Aptitude", 0, 10, 5)
    communication = st.slider("Communication", 0, 10, 5)
    core_subjects = st.slider("Core Subjects", 0, 10, 5)

    profile = {
        "branch": branch,
        "cgpa": cgpa,
        "internships": internships,
        "projects": projects,
        "certifications": certifications,
        "programming": programming,
        "aptitude": aptitude,
        "communication": communication,
        "core_subjects": core_subjects
    }

else:
    uploaded_file = st.file_uploader("Upload Resume (PDF)", type=["pdf"])
    if uploaded_file:
        profile = extract_from_resume(uploaded_file)
        st.json(profile)
    else:
        profile = None

if profile:
    readiness = rule_based_score(profile)
    probability = ml_probability(profile)

    st.subheader("Results")
    st.write("Readiness Score:", readiness)
    st.write("Placement Probability:", probability)













