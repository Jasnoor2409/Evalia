# ==================================================
# TRAINING SCRIPT FOR PLACEMENT PROBABILITY MODEL
# Dataset: Campus Recruitment Dataset (Kaggle)
# Model: Logistic Regression
# ==================================================

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
import joblib

# ==================================================
# 1. LOAD DATASET
# ==================================================
df = pd.read_csv("Placement_Data_Full_Class.csv")

print("Dataset loaded successfully")
print("Shape:", df.shape)

# ==================================================
# 2. SELECT ONLY REQUIRED COLUMNS
# ==================================================
df = df[
    [
        "degree_p",        # Degree percentage
        "etest_p",         # Aptitude test percentage
        "workex",          # Work experience (Yes/No)
        "specialisation",  # Branch / specialization
        "status"           # Placement status
    ]
]

# ==================================================
# 3. HANDLE MISSING VALUES
# ==================================================
df.dropna(inplace=True)

# ==================================================
# 4. FEATURE ENGINEERING
# ==================================================

# Convert degree percentage to CGPA (out of 10)
df["cgpa"] = df["degree_p"] / 10

# Convert work experience to binary
df["internship"] = df["workex"].map({"Yes": 1, "No": 0})

# Encode specialization (branch)
branch_encoder = LabelEncoder()
df["branch"] = branch_encoder.fit_transform(df["specialisation"])

# Encode target variable
df["placed"] = df["status"].map({"Placed": 1, "Not Placed": 0})

# ==================================================
# 5. FINAL FEATURE MATRIX & TARGET
# ==================================================
X = df[
    [
        "cgpa",
        "etest_p",
        "internship",
        "branch"
    ]
]

y = df["placed"]

# ==================================================
# 6. TRAIN–TEST SPLIT
# ==================================================
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# ==================================================
# 7. TRAIN LOGISTIC REGRESSION MODEL
# ==================================================
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

# ==================================================
# 8. EVALUATION
# ==================================================
y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)
print("\nModel Accuracy:", round(accuracy * 100, 2), "%")

print("\nClassification Report:\n")
print(classification_report(y_test, y_pred))

# ==================================================
# 9. SAVE TRAINED MODEL
# ==================================================
joblib.dump(model, "placement_model.pkl")

print("\nModel saved successfully as placement_model.pkl")
