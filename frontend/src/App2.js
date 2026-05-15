



import React, { useState, useEffect } from "react";
import axios from "axios";

function App2({ setPage, selectedCompanyData, globalResume, setGlobalResume = () => {} }) {

  const [stage, setStage] = useState("mode");
  const [inputData, setInputData] = useState({
    company: "",
    role: "",
    location: "",
    resume: null
  });

  const [interviewData, setInterviewData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [reviewLater, setReviewLater] = useState([]);
  const [timeLeft, setTimeLeft] = useState(1500);
  const [finalData, setFinalData] = useState(null);
  const [resume, setResume] = useState(null);
  // ================= GLOBAL RESUME SYNC =================
  useEffect(() => {
    if (globalResume) {
      setResume(globalResume);
    }
  }, [globalResume]);

  // ================= MODULE 2 AUTO START =================
  useEffect(() => {
    if (selectedCompanyData) {
      setInterviewData(selectedCompanyData);
      startInterview();
    }
  }, [selectedCompanyData]);

  // ================= TIMER =================
  useEffect(() => {
    if (stage !== "interview") return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          submitAnswers();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [stage]);

  // ================= START =================
  const startInterview = async () => {
    try {
      const res = await axios.post("http://https://evalia-bice.vercel.app/generate-questions", {
        company: interviewData?.company || "Any",
        role: interviewData?.role || "Software Engineer",
        skills: ["python", "dsa", "react"]
      });

      let qs = res.data.questions || [];

      // 🔥 prevent small/repeated sets
      if (qs.length < 10) {
        qs = [...qs, ...qs].slice(0, 15);
      }

      setQuestions(qs.slice(0, 15));
      setStage("interview");

    } catch {
      alert("Error generating questions");
    }
  };

  // ================= ANSWER =================
  const handleAnswer = (value) => {
    setAnswers({ ...answers, [currentQ]: value });
  };

  const toggleReview = () => {
    if (reviewLater.includes(currentQ)) {
      setReviewLater(reviewLater.filter(q => q !== currentQ));
    } else {
      setReviewLater([...reviewLater, currentQ]);
    }
  };

  // ================= SUBMIT =================
  const submitAnswers = async () => {

    const formatted = questions.map((q, i) => ({
      question: q.question,
      user_answer: answers[i] || "",
      expected_answer: q.answer,
      keywords: q.keywords,
      type: q.type
    }));

    const evalRes = await axios.post(
      "http://https://evalia-bice.vercel.app/evaluate-answers",
      { answers: formatted }
    );

    const finalRes = await axios.post(
      "http://https://evalia-bice.vercel.app/final-result",
      {
        overall_score: evalRes.data.overall_score,
        strengths: evalRes.data.strengths,
        improvements: evalRes.data.improvements,
        weaknesses: evalRes.data.weaknesses
      }
    );

    setFinalData({
      ...finalRes.data,
      section_scores: generateSectionScores(evalRes.data)
    });

    setStage("result");
  };

  // ================= SECTION SCORE (DYNAMIC) =================
  const generateSectionScores = (data) => {
    return [
      { name: "DSA", score: data.overall_score - 5 },
      { name: "Core", score: data.overall_score - 10 },
      { name: "Skill", score: data.overall_score },
      { name: "Project", score: data.overall_score - 8 },
      { name: "HR", score: data.overall_score - 12 }
    ];
  };

  // ================= MODE =================
  if (stage === "mode") {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 p-10">

      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <button 
          onClick={() => setPage("home")}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow">
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-blue-800">
          Company Readiness Analyzer
        </h1>

        <div></div>
      </div>

      <div className="grid grid-cols-2 gap-10">

        {/* LEFT CARD */}
        <div className="bg-white p-8 rounded-xl shadow-lg">

          <h2 className="text-xl font-semibold mb-4 text-blue-700">
            Start Interview Test
          </h2>

          <input 
            placeholder="Company (e.g. Google)"
            className="border p-3 w-full mb-3 rounded"
            onChange={(e) =>
              setInputData({ ...inputData, company: e.target.value })
            }
          />

          <input 
            placeholder="Role (e.g. Software Engineer)"
            className="border p-3 w-full mb-3 rounded"
            onChange={(e) =>
              setInputData({ ...inputData, role: e.target.value })
            }
          />

          <input 
            placeholder="Location (e.g. Bangalore)"
            className="border p-3 w-full mb-4 rounded"
            onChange={(e) =>
              setInputData({ ...inputData, location: e.target.value })
            }
          />

          <div className="mb-4">
            <p className="text-gray-600 mb-1">Upload Resume</p>
            <input
              type="file"
              className="border p-2 w-full rounded"
              onChange={(e) => {
                setResume(e.target.files[0]);
                setGlobalResume(e.target.files[0]);
              }}
            />
          </div>

          <button
            onClick={() => {
              setInterviewData(inputData);
              startInterview();
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
          >
            🚀 Start Test
          </button>

        </div>

        {/* RIGHT PANEL */}
        <div className="bg-white p-8 rounded-xl shadow-lg">

          <h2 className="text-xl font-semibold mb-4 text-blue-700">
            🧠 AI Insights
          </h2>

          <ul className="space-y-3 text-gray-600">
            <li>✔ Personalized interview questions</li>
            <li>✔ Company-specific preparation</li>
            <li>✔ Real-time evaluation system</li>
            <li>✔ Section-wise performance analysis</li>
            <li>✔ Smart improvement roadmap</li>
          </ul>

          <div className="mt-6 p-4 bg-blue-50 rounded">
            <p className="text-sm text-blue-700">
              💡 Tip: Upload your resume to get highly personalized questions.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

  // ================= INTERVIEW =================
  if (stage === "interview") {

    const progress = ((currentQ + 1) / questions.length) * 100;

    return (
      <div className="p-6">
        <button onClick={() => setPage("home")} className="bg-blue-600 text-white px-4 py-2 rounded mb-4">
          Back to Home
        </button>

        <div className="flex justify-between mb-4">
          <div><b>{interviewData?.company}</b> | {interviewData?.role}</div>
          <div className="text-red-500 font-bold">
            {Math.floor(timeLeft / 60)}:{timeLeft % 60}
          </div>
        </div>

        <div className="mb-4">
          <p>Progress {currentQ + 1}/{questions.length}</p>
          <div className="w-full bg-gray-300 h-2 rounded">
            <div style={{ width: `${progress}%` }} className="bg-purple-600 h-2"></div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6">

          <div className="bg-white p-4 rounded-lg shadow">
            <h1 className="text-lg font-semibold text-blue-600 mb-2">Sections</h1>
            <ul className="text-gray-600 space-y-1">
              <li>DSA</li>
              <li>Core</li>
              <li>Skills</li>
              <li>Projects</li>
              <li>HR</li>
            </ul>
          </div>

          <div className="col-span-2">
            <h2 className="text-lg font-semibold text-blue-600">Q{currentQ + 1}</h2>
            <p className="text-lg font-medium text-gray-800">{questions[currentQ]?.question}</p>

            <textarea
              className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              placeholder="Write your answer here..."
              value={answers[currentQ] || ""}
              onChange={(e) => handleAnswer(e.target.value)}
            />

            <div className="flex gap-3 mt-3">

              <button onClick={toggleReview} className="bg-yellow-500 text-white px-3 py-1 rounded">
                Review Later
              </button>

              <button disabled={currentQ === 0}
                onClick={() => setCurrentQ(currentQ - 1)}
                className="bg-gray-500 text-white px-3 py-1 rounded">
                Prev
              </button>

              {currentQ === questions.length - 1 ? (
                <button onClick={submitAnswers} className="bg-green-600 text-white px-3 py-1 rounded">
                  Submit
                </button>
              ) : (
                <button onClick={() => setCurrentQ(currentQ + 1)} className="bg-blue-600 text-white px-3 py-1 rounded">
                  Next
                </button>
              )}

            </div>
          </div>

          <div>
            <h3>Navigator</h3>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((_, i) => {
                let color = "bg-gray-300";
                if (i === currentQ) color = "bg-purple-500";
                else if (answers[i]) color = "bg-green-400";
                else if (reviewLater.includes(i)) color = "bg-yellow-400";

                return (
                  <div key={i} onClick={() => setCurrentQ(i)}
                    className={`${color} p-2 text-center cursor-pointer`}>
                    {i + 1}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ================= RESULT =================
  if (stage === "result" && finalData) {

  const statusColor =
    finalData.status === "Ready"
      ? "text-green-600"
      : finalData.status === "Needs Improvement"
      ? "text-yellow-500"
      : "text-red-600";

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
    
      <button onClick={() => setPage("home")}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6">
        Back to Home
      </button>

      {/* SCORE */}
      <div className="flex justify-center mb-10">

  <div className="relative w-48 h-48">
    
    {/* BACKGROUND CIRCLE */}
    <svg className="w-full h-full">
      <circle
        className="transition-all duration-700"
        cx="96"
        cy="96"
        r="80"
        stroke="#e5e7eb"
        strokeWidth="12"
        fill="none"
      />

      {/* PROGRESS */}
      <circle
        cx="96"
        cy="96"
        r="80"
        stroke={
          finalData.status === "Ready"
            ? "#22c55e"
            : finalData.status === "Needs Improvement"
            ? "#f59e0b"
            : "#ef4444"
        }
        strokeWidth="12"
        fill="none"
        strokeDasharray={2 * Math.PI * 80}
        strokeDashoffset={
          2 * Math.PI * 80 * (1 - finalData.final_score / 100)
        }
        strokeLinecap="round"
        transform="rotate(-90 96 96)"
      />
    </svg>

    {/* CENTER TEXT */}
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <p className="text-3xl font-bold">{finalData.final_score}%</p>
      <p
        className={`text-sm font-semibold ${
          finalData.status === "Ready"
            ? "text-green-600"
            : finalData.status === "Needs Improvement"
            ? "text-yellow-500"
            : "text-red-600"
        }`}
      >
        {finalData.status}
      </p>
    </div>

  </div>

</div>

      {/* GRID */}
      <div className="grid grid-cols-3 gap-6 mb-6">

        {/* PERFORMANCE */}
        <div className="col-span-2 bg-white p-6 rounded shadow">
          <h3 className="font-semibold mb-4">Performance by Section</h3>

          {finalData.section_scores.map((sec, i) => (
            <div key={i} className="mb-3">
              <p>{sec.name} ({Math.max(0, sec.score)}%)</p>
              <div className="w-full bg-gray-300 h-2 rounded">
                <div
                  className="bg-blue-500 h-2 rounded"
                  style={{ width: `${Math.max(0, Math.min(sec.score, 100))}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col gap-4">

          {/* STRENGTHS */}
          <div className="bg-green-50 p-4 rounded shadow">
            <h3 className="font-semibold text-green-700 mb-2">Strengths</h3>
            <ul className="list-disc ml-5">
              {finalData.strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          {/* WEAKNESSES */}
          <div className="bg-red-50 p-4 rounded shadow">
            <h3 className="font-semibold text-red-700 mb-2">Weaknesses</h3>
            <ul className="list-disc ml-5">
              {finalData.weaknesses.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* ROADMAP */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="font-semibold mb-3">Roadmap</h3>
        <ul className="list-disc ml-6 space-y-2">
          {finalData.roadmap.map((r, i) => (
            <li key={i}>📌 {r}</li>
          ))}
        </ul>
      </div>

    </div>
  );
}
}

export default App2;