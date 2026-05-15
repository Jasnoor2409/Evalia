import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Home from "./Home";
import OpportunityFinder from "./App1";
import App2 from "./App2";
function App() {
  const [page, setPage] = useState("home");
  const [globalResume, setGlobalResume] = useState(null);
  const [mode, setMode] = useState("resume");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCompanyData, setSelectedCompanyData] = useState(null);
  const [profile, setProfile] = useState({
    branch: "CSE",
    cgpa: 7,
    internships: 0,
    projects: 0,
    certifications: 0,
  });
  useEffect(() => {
    if (globalResume) {
      setFile(globalResume);
    }
  }, [globalResume]);
  const [skills, setSkills] = useState({
    programming: 6,
    aptitude: 5,
    communication: 5,
    core_subjects: 5,
  });

  const [result, setResult] = useState(null);
  const [analyzed, setAnalyzed] = useState(false);

  // ================= Resume Analyze =================
  const analyzeResume = async () => {
    if (!file) {
      alert("Please upload resume first");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "https://evalia-bice.vercel.app/predict",
        formData
      );

      setProfile(response.data.profile);

      setSkills({
        programming: response.data.profile.programming,
        aptitude: response.data.profile.aptitude,
        communication: response.data.profile.communication,
        core_subjects: response.data.profile.core_subjects,
      });

      setResult({
        readiness: response.data.readiness_score,
        probability: response.data.placement_probability,
        status:
          response.data.placement_probability > 75
            ? "Likely Placed"
            : response.data.placement_probability > 50
            ? "Moderate Chance"
            : "Needs Improvement",
      });

      setAnalyzed(true);
    } catch (error) {
      console.log(error);
      alert("Resume Analysis Error");
    }

    setLoading(false);
  };

  // ================= Manual Analyze =================
  const analyzeManual = useCallback(async () => {
    setLoading(true);

    try {
      const response = await axios.post(
        "https://evalia-bice.vercel.app/predict_manual",
        {
          ...profile,
          ...skills,
        }
      );

      setResult({
        readiness: response.data.readiness_score,
        probability: response.data.placement_probability,
        status:
          response.data.placement_probability > 75
            ? "Likely Placed"
            : response.data.placement_probability > 50
            ? "Moderate Chance"
            : "Needs Improvement",
      });

      setAnalyzed(true);
    } catch (error) {
      console.log(error);
      alert("Manual Analysis Error");
    }

    setLoading(false);
  }, [profile, skills]);

  // Live update when sliders change
  useEffect(() => {
    if (analyzed && mode === "manual") {
      analyzeManual();
    }
  }, [skills]);

  const statusColor =
    result?.status === "Likely Placed"
      ? "text-green-600"
      : result?.status === "Moderate Chance"
      ? "text-yellow-500"
      : "text-red-600";

  const improvements = [];

  if (profile) {
    if (profile.internships === 0)
      improvements.push("Gain internship experience.");
    if (profile.certifications === 0)
      improvements.push("Complete relevant certifications.");
    if (profile.projects < 2)
      improvements.push("Build more technical projects.");
    if (skills.aptitude < 6)
      improvements.push("Improve aptitude skills.");
    if (skills.programming < 6)
      improvements.push("Improve programming skills.");
    if (skills.communication < 6)
      improvements.push("Improve communication skills.");
  }

  // ================= HOME PAGE =================
if (page === "home") {
  return <Home setPage={setPage} />;
}

if (page === "module2") {
  return (
    <OpportunityFinder
      setPage={setPage}
      setSelectedCompanyData={setSelectedCompanyData}
      globalResume={globalResume}
      setGlobalResume={setGlobalResume}
    />
  );
}

if (page === "module3") {
  return (
    <App2
      setPage={setPage}
      selectedCompanyData={selectedCompanyData}
      globalResume={globalResume}
      setGlobalResume={setGlobalResume}
    />
  );
}
  // ================= MODULE 1 PAGE =================
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Back Button */}
        <button
          onClick={() => setPage("home")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Back to Home
        </button>

        {/* HEADER */}
        <div className="bg-blue-700 text-white text-center p-6 rounded shadow">
          <h1 className="text-2xl font-bold">
            AI-Based Placement & Career Intelligence Platform
          </h1>
          <p className="text-sm mt-2">
            Smart Placement Readiness & Probability Analyzer
          </p>
        </div>

        {/* MODE */}
        <div className="bg-white p-4 rounded shadow flex gap-6">
          <label>
            <input
              type="radio"
              checked={mode === "resume"}
              onChange={() => setMode("resume")}
            /> Resume Upload
          </label>

          <label>
            <input
              type="radio"
              checked={mode === "manual"}
              onChange={() => setMode("manual")}
            /> Manual Input
          </label>
        </div>

        {/* RESUME */}
        {mode === "resume" && (
          <div className="bg-white p-6 rounded shadow flex gap-4">
            <input
              type="file"
              onChange={(e) => {
                setFile(e.target.files[0]);
                setGlobalResume(e.target.files[0]); 
              }}
              className="flex-1"
            />
            <button
              onClick={analyzeResume}
              className="bg-blue-600 text-white px-6 py-2 rounded"
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </div>
        )}

        {/* MANUAL */}
        {mode === "manual" && (
          <div className="bg-white p-6 rounded shadow space-y-4">
            <div className="grid grid-cols-2 gap-4">

              <select
                className="border p-2 rounded"
                onChange={(e) =>
                  setProfile({ ...profile, branch: e.target.value })
                }
              >
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="Mechanical">Mechanical</option>
              </select>

              <input
                type="number"
                placeholder="CGPA"
                className="border p-2 rounded"
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    cgpa: Number(e.target.value),
                  })
                }
              />

              <input
                type="number"
                placeholder="Internships"
                className="border p-2 rounded"
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    internships: Number(e.target.value),
                  })
                }
              />

              <input
                type="number"
                placeholder="Projects"
                className="border p-2 rounded"
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    projects: Number(e.target.value),
                  })
                }
              />

              <input
                type="number"
                placeholder="Certifications"
                className="border p-2 rounded"
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    certifications: Number(e.target.value),
                  })
                }
              />

            </div>

            <button
              onClick={analyzeManual}
              className="bg-blue-600 text-white px-6 py-2 rounded"
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </div>
        )}

        {/* RESULTS */}
        {analyzed && result && (
          <>
            {/* METRICS */}
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded shadow">
                <h3>Readiness Score</h3>
                <p className="text-2xl font-bold text-green-600">
                  {result.readiness} / 100
                </p>
              </div>

              <div className="bg-white p-4 rounded shadow">
                <h3>Placement Probability</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {result.probability}%
                </p>
              </div>

              <div className="bg-white p-4 rounded shadow">
                <h3>Predicted Status</h3>
                <p className={`text-xl font-bold ${statusColor}`}>
                  {result.status}
                </p>
              </div>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-2 gap-6">

              {/* Skill Sliders */}
              <div className="bg-white p-6 rounded shadow">
                <h3 className="font-semibold mb-4">Skill Analysis</h3>

                {Object.keys(skills).map((key) => (
                  <div key={key} className="mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">{key}</span>
                      <span>{skills[key]} / 10</span>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={skills[key]}
                      onChange={(e) =>
                        setSkills({
                          ...skills,
                          [key]: Number(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>
                ))}
              </div>

              {/* Profile Summary */}
              <div className="bg-white p-6 rounded shadow">
                <h3 className="font-semibold mb-4">
                  Extracted Profile Summary
                </h3>

                <div className="space-y-2">
                  <p><b>Branch:</b> {profile.branch}</p>
                  <p><b>CGPA:</b> {profile.cgpa}</p>
                  <p><b>Internships:</b> {profile.internships}</p>
                  <p><b>Projects:</b> {profile.projects}</p>
                  <p><b>Certifications:</b> {profile.certifications}</p>
                </div>
              </div>

              {/* Graph */}
              <div className="bg-white p-6 rounded-xl shadow-lg">

  {/* HEADER */}
  <div className="flex justify-between items-center mb-6">
    <h3 className="font-semibold text-lg text-gray-800">
      Skill Level Analysis
    </h3>
    <span className="text-sm text-gray-500">Score /10</span>
  </div>

  {/* GRAPH CONTAINER */}
  <div className="flex">

    {/* Y AXIS */}
    <div className="flex flex-col justify-between h-64 mr-2 text-xs text-gray-400">
      {[10, 8, 6, 4, 2, 0].map((val) => (
        <span key={val}>{val}</span>
      ))}
    </div>

    {/* GRAPH AREA */}
    <div className="flex-1 border-l border-b border-gray-300 relative h-64">

      <div className="flex justify-around items-end h-full px-4">

        {Object.keys(skills).map((key) => {
          const value = skills[key];

          return (
            <div key={key} className="flex flex-col items-center">

              {/* BAR */}
              <div className="w-10 flex items-end h-56">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-blue-700 to-blue-300 shadow-md transition-all duration-700"
                  style={{
                    height: `${(value / 10) * 100}%`
                  }}
                ></div>
              </div>

              {/* X AXIS LABEL */}
              <span className="text-xs mt-2 text-gray-600 text-center capitalize">
                {key.replace("_", " ")}
              </span>

            </div>
          );
        })}

      </div>

    </div>
  </div>

</div>

              {/* Strengths Weakness */}
              <div className="bg-white p-6 rounded shadow">
                <h3 className="font-semibold mb-4">
                  Strengths & Weaknesses
                </h3>

                {(() => {
  let strengths = [];
  let weaknesses = [];

  console.log("PROFILE:", profile);

  // PROFILE BASED
  if (profile.projects >= 4) strengths.push("Strong project experience");
  else if (profile.projects < 2) weaknesses.push("Lack of projects");

  if (profile.internships >= 1) strengths.push("Industry exposure");
  else weaknesses.push("No internship experience");

  if (profile.certifications >= 2)
    strengths.push("Certified skills");
  else weaknesses.push("Few certifications");

  if (profile.cgpa >= 8) strengths.push("Strong academics");
  else if (profile.cgpa < 6) weaknesses.push("Low CGPA");

  // SKILLS (only fallback)
  if (strengths.length === 0) {
    Object.keys(skills).forEach((k) => {
      if (skills[k] >= 8) strengths.push(`Strong in ${k}`);
    });
  }

  if (weaknesses.length === 0) {
    Object.keys(skills).forEach((k) => {
      if (skills[k] < 5) weaknesses.push(`Weak in ${k}`);
    });
  }

  return (
    <>
      <p className="text-green-600 font-semibold">Strengths</p>
      <ul className="list-disc ml-6 mb-4">
        {strengths.map((k, i) => <li key={i}>{k}</li>)}
      </ul>

      <p className="text-red-600 font-semibold">Weaknesses</p>
      <ul className="list-disc ml-6">
        {weaknesses.map((k, i) => <li key={i}>{k}</li>)}
      </ul>
    </>
  );
})()}
              </div>
            </div>
            
            {/* Improvements */}
            <div className="bg-white p-6 rounded shadow">
              <h3 className="font-semibold mb-4">
                What Can Be Done To Improve?
              </h3>

              <ul className="list-disc ml-6 space-y-2">
                {improvements.length > 0 ? (
                  improvements.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))
                ) : (
                  <li>Your profile is strong. Maintain consistency.</li>
                )}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;



