# Evalia – AI Driven Placement & Career Decision Support System

## 50% Project Submission – Module 1 Completed

### Project Overview

Evalia is an AI-based Placement & Career Decision Support System designed to help students evaluate their placement readiness, identify skill gaps, and improve their chances of getting placed.

The system analyzes student resumes or manual inputs and predicts placement readiness score and placement probability using Machine Learning and rule-based analysis.

---

## Module 1 – Placement Readiness Analyzer (Completed)

Module 1 allows users to:

* Upload Resume (PDF)
* Extract student profile from resume
* Enter details manually
* Calculate Placement Readiness Score
* Predict Placement Probability using Machine Learning
* Analyze Skills (Programming, Aptitude, Communication, Core Subjects)
* Display Skill Graph
* Identify Strengths & Weaknesses
* Provide Improvement Suggestions
* Simulate improvement using skill sliders

---

## Features Implemented

* Resume Parsing using pdfplumber
* Profile Extraction from Resume
* GPA to CGPA Conversion
* Rule-Based Placement Readiness Score
* Machine Learning Placement Prediction (Logistic Regression)
* Skill Analysis Dashboard
* Graph Visualization
* Manual Input Simulation
* Dynamic Score Updates

---

## Machine Learning Model

The placement probability is predicted using a Logistic Regression model trained on a placement dataset.

### Input Features Used:

* CGPA
* Aptitude Score
* Internship Experience
* Branch

### Output:

* Placement Probability (%)

---

## Technologies Used

Frontend:

* React.js
* Tailwind CSS
* Recharts
* Axios

Backend:

* FastAPI
* Python
* Pandas
* Scikit-learn
* Joblib
* pdfplumber

Machine Learning:

* Logistic Regression

---

## How to Run the Project

### Backend

cd backend
uvicorn app:app --reload

### Frontend

cd frontend
npm start

---

## Project Structure

Evalia/
│
├── backend/
│   ├── app.py
│   ├── placement_model.pkl
│
├── frontend/
│   ├── src/
│   ├── package.json
│
├── README.md
├── requirements.txt

---

## 100% Project Plan (Upcoming Modules)

### Module 2 – Smart Internship & Opportunity Finder

* Recommend internships/jobs based on student profile
* Match score calculation
* Opportunity ranking
* Application links
* Search and filter system

### Module 3 – Company Interview Readiness Analyzer

* Company-specific skill requirement analysis
* Interview readiness score
* Skill gap detection
* Personalized preparation roadmap
* Mock test based on company

---

## Conclusion

The system aims to help students make better career decisions by analyzing their profiles, predicting placement probability, and guiding them towards improving their skills and opportunities using Artificial Intelligence and Machine Learning.
