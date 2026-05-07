# 🚀 Evalia – AI Driven Placement & Career Decision Support System

Evalia is an AI-powered web platform designed to help students evaluate their placement readiness, discover suitable opportunities, and improve interview performance through personalized analysis and feedback.

The system integrates machine learning, resume analysis, job recommendation, and interview preparation into a single unified platform.

---

## ✨ Features

### 📄 Placement Readiness Analyzer

* Resume analysis and skill extraction
* Placement probability prediction
* Readiness score generation
* Personalized improvement suggestions

### 💼 Opportunity Finder

* Job recommendation system
* Skill-based matching
* Missing skill identification
* Career roadmap suggestions

### 🧠 Company Readiness Analyzer

* AI-generated interview questions
* Company-specific preparation
* Answer evaluation using NLP
* Performance tracking and feedback

---

## 🏗️ Tech Stack

### Frontend

* React.js
* Tailwind CSS

### Backend

* FastAPI
* Python

### Machine Learning / NLP

* Scikit-learn
* Logistic Regression
* TF-IDF Vectorization
* Cosine Similarity

### Other Tools

* pdfplumber
* Pandas
* NumPy

---

## 📁 Project Structure

```text
Evalia/
│
├── backend/
│   ├── app.py
│   ├── generate_questions.py
│   ├── placement_model.pkl
│   └── datasets/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── models/
├── data/
├── train_model.py
├── requirements.txt
└── README.md
```

---

## ⚙️ Working Flow

1. User uploads resume or enters details
2. Backend processes resume and extracts information
3. Machine learning models analyze student profile
4. System generates:

   * Placement readiness score
   * Placement probability
   * Job recommendations
   * Skill gap analysis
   * Interview feedback
5. Results are displayed on the interactive dashboard

---

## 🧠 Algorithms Used

### Logistic Regression

Used for placement prediction and readiness evaluation.

### TF-IDF Vectorization

Converts textual answers into numerical vectors for processing.

### Cosine Similarity

Measures similarity between student answers and expected answers during interview evaluation.

---

## 🚀 Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/Jasnoor2409/Evalia.git
cd Evalia
```

---

### 2. Backend Setup

```bash
python -m venv venv
venv\Scripts\activate

pip install -r requirements.txt
```

Run backend server:

```bash
uvicorn backend.app:app --reload
```

---

### 3. Frontend Setup

```bash
cd frontend

npm install
npm start
```

---

## 📊 Core Functionalities

* Resume Parsing
* Placement Prediction
* Skill Gap Detection
* Job Recommendation
* AI-Based Interview Evaluation
* Personalized Learning Roadmap

---

## 📌 Future Improvements

* Real-time job portal integration
* Voice-based interview simulation
* Advanced NLP models
* Coding assessment integration
* Multi-language support

---

This project demonstrates the practical implementation of machine learning and NLP techniques in solving real-world placement and career guidance problems.
