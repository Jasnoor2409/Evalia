// import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";


// function App() {
//   const [mode, setMode] = useState("resume");
//   const [file, setFile] = useState(null);

//   const [profile, setProfile] = useState({
//     branch: "CSE",
//     cgpa: 7,
//     internships: 0,
//     projects: 0,
//     certifications: 0,
//   });

//   const [skills, setSkills] = useState({
//     programming: 6,
//     aptitude: 5,
//     communication: 5,
//     core_subjects: 5,
//   });

//   const [result, setResult] = useState(null);
//   const [analyzed, setAnalyzed] = useState(false);

//   // ================= Resume Analyze =================
//   const analyzeResume = async () => {
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("file", file);

//     const response = await axios.post(
//       "http://127.0.0.1:8000/predict",
//       formData
//     );

//     setProfile(response.data.profile);

//     setSkills({
//       programming: response.data.profile.programming,
//       aptitude: response.data.profile.aptitude,
//       communication: response.data.profile.communication,
//       core_subjects: response.data.profile.core_subjects,
//     });

//     setResult({
//       readiness: response.data.readiness_score,
//       probability: response.data.placement_probability,
//       status:
//         response.data.placement_probability > 75
//           ? "Likely Placed"
//           : response.data.placement_probability > 50
//           ? "Moderate Chance"
//           : "Needs Improvement",
//     });

//     setAnalyzed(true);
//   };

//   // ================= Manual Analyze =================
//   const analyzeManual = useCallback(async () => {
//     if (!profile) return;

//     const response = await axios.post(
//       "http://127.0.0.1:8000/predict_manual",
//       {
//         ...profile,
//         ...skills,
//       }
//     );

//     setResult({
//       readiness: response.data.readiness_score,
//       probability: response.data.placement_probability,
//       status:
//         response.data.placement_probability > 75
//           ? "Likely Placed"
//           : response.data.placement_probability > 50
//           ? "Moderate Chance"
//           : "Needs Improvement",
//     });

//     setAnalyzed(true);
//   }, [profile, skills]);

//   // Live update when sliders change
//   useEffect(() => {
//     if (analyzed && mode === "manual") {
//       analyzeManual();
//     }
//   }, [skills, analyzed, analyzeManual, mode]);

//   const statusColor =
//     result?.status === "Likely Placed"
//       ? "text-green-600"
//       : result?.status === "Moderate Chance"
//       ? "text-yellow-500"
//       : "text-red-600";

//   const improvements = [];

//   if (profile) {
//     if (profile.internships === 0)
//       improvements.push("Gain internship experience.");
//     if (profile.certifications === 0)
//       improvements.push("Complete relevant certifications.");
//     if (profile.projects < 2)
//       improvements.push("Build more technical projects.");
//     if (skills.aptitude < 6)
//       improvements.push("Improve aptitude skills.");
//     if (skills.programming < 6)
//       improvements.push("Improve programming skills.");
//     if (skills.communication < 6)
//       improvements.push("Improve communication skills.");
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <div className="max-w-6xl mx-auto space-y-6">

//         {/* HEADER */}
//         <div className="bg-blue-700 text-white text-center p-6 rounded shadow">
//           <h1 className="text-2xl font-bold">
//             AI-Based Placement & Career Intelligence Platform
//           </h1>
//           <p className="text-sm mt-2">
//             Smart Placement Readiness & Probability Analyzer
//           </p>
//         </div>

//         {/* MODE */}
//         <div className="bg-white p-4 rounded shadow flex gap-6">
//           <label>
//             <input
//               type="radio"
//               checked={mode === "resume"}
//               onChange={() => setMode("resume")}
//             /> Resume Upload
//           </label>

//           <label>
//             <input
//               type="radio"
//               checked={mode === "manual"}
//               onChange={() => setMode("manual")}
//             /> Manual Input
//           </label>
//         </div>

//         {/* RESUME */}
//         {mode === "resume" && (
//           <div className="bg-white p-6 rounded shadow flex gap-4">
//             <input
//               type="file"
//               onChange={(e) => setFile(e.target.files[0])}
//               className="flex-1"
//             />
//             <button
//               onClick={analyzeResume}
//               className="bg-blue-600 text-white px-6 py-2 rounded"
//             >
//               Analyze
//             </button>
//           </div>
//         )}

//         {/* MANUAL */}
//         {mode === "manual" && (
//           <div className="bg-white p-6 rounded shadow space-y-4">
//             <div className="grid grid-cols-2 gap-4">

//               <select
//                 className="border p-2 rounded"
//                 onChange={(e) =>
//                   setProfile({ ...profile, branch: e.target.value })
//                 }
//               >
//                 <option value="CSE">CSE</option>
//                 <option value="IT">IT</option>
//                 <option value="ECE">ECE</option>
//                 <option value="Mechanical">Mechanical</option>
//               </select>

//               <input
//                 type="number"
//                 placeholder="CGPA"
//                 className="border p-2 rounded"
//                 onChange={(e) =>
//                   setProfile({
//                     ...profile,
//                     cgpa: Number(e.target.value),
//                   })
//                 }
//               />

//               <input
//                 type="number"
//                 placeholder="Internships"
//                 className="border p-2 rounded"
//                 onChange={(e) =>
//                   setProfile({
//                     ...profile,
//                     internships: Number(e.target.value),
//                   })
//                 }
//               />

//               <input
//                 type="number"
//                 placeholder="Projects"
//                 className="border p-2 rounded"
//                 onChange={(e) =>
//                   setProfile({
//                     ...profile,
//                     projects: Number(e.target.value),
//                   })
//                 }
//               />

//               <input
//                 type="number"
//                 placeholder="Certifications"
//                 className="border p-2 rounded"
//                 onChange={(e) =>
//                   setProfile({
//                     ...profile,
//                     certifications: Number(e.target.value),
//                   })
//                 }
//               />

//             </div>

//             <button
//               onClick={analyzeManual}
//               className="bg-blue-600 text-white px-6 py-2 rounded"
//             >
//               Analyze
//             </button>
//           </div>
//         )}

//         {/* RESULTS */}
//         {analyzed && result && (
//           <>
//             {/* METRICS */}
//             <div className="grid grid-cols-3 gap-6">
//               <div className="bg-white p-4 rounded shadow">
//                 <h3>Readiness Score</h3>
//                 <p className="text-2xl font-bold text-green-600">
//                   {result.readiness} / 100
//                 </p>
//               </div>

//               <div className="bg-white p-4 rounded shadow">
//                 <h3>Placement Probability</h3>
//                 <p className="text-2xl font-bold text-blue-600">
//                   {result.probability}%
//                 </p>
//               </div>

//               <div className="bg-white p-4 rounded shadow">
//                 <h3>Predicted Status</h3>
//                 <p className={`text-xl font-bold ${statusColor}`}>
//                   {result.status}
//                 </p>
//               </div>
//             </div>

//             {/* GRID */}
//             <div className="grid grid-cols-2 gap-6">

//               {/* Skill Sliders */}
//               <div className="bg-white p-6 rounded shadow">
//                 <h3 className="font-semibold mb-4">Skill Analysis</h3>

//                 {Object.keys(skills).map((key) => (
//                   <div key={key} className="mb-4">
//                     <div className="flex justify-between text-sm">
//                       <span className="capitalize">{key}</span>
//                       <span>{skills[key]} / 10</span>
//                     </div>

//                     <input
//                       type="range"
//                       min="0"
//                       max="10"
//                       value={skills[key]}
//                       onChange={(e) =>
//                         setSkills({
//                           ...skills,
//                           [key]: Number(e.target.value),
//                         })
//                       }
//                       className="w-full"
//                     />
//                   </div>
//                 ))}
//               </div>

//               {/* Profile Summary */}
//               <div className="bg-white p-6 rounded shadow">
//                 <h3 className="font-semibold mb-4">
//                   Extracted Profile Summary
//                 </h3>

//                 <div className="space-y-2">
//                   <p><b>Branch:</b> {profile.branch}</p>
//                   <p><b>CGPA:</b> {profile.cgpa}</p>
//                   <p><b>Internships:</b> {profile.internships}</p>
//                   <p><b>Projects:</b> {profile.projects}</p>
//                   <p><b>Certifications:</b> {profile.certifications}</p>
//                 </div>
//               </div>

//               {/* Graph */}
//               <div className="bg-white p-6 rounded shadow">
//                 <h3 className="font-semibold mb-4">
//                   Skill Level Analysis
//                 </h3>

//                 <div className="flex justify-around items-end h-48 border-l border-b">
//                   {Object.keys(skills).map((key) => (
//                     <div key={key} className="flex flex-col items-center">
//                       <div
//                         className="bg-blue-600 w-10 rounded"
//                         style={{ height: `${skills[key] * 12}px` }}
//                       ></div>
//                       <span className="text-xs mt-2 capitalize">
//                         {key}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Strengths Weakness */}
//               <div className="bg-white p-6 rounded shadow">
//                 <h3 className="font-semibold mb-4">
//                   Strengths & Weaknesses
//                 </h3>

//                 <p className="text-green-600 font-semibold">
//                   Strengths
//                 </p>
//                 <ul className="list-disc ml-6 mb-4">
//                   {Object.keys(skills)
//                     .filter((k) => skills[k] >= 7)
//                     .map((k) => (
//                       <li key={k}>{k}</li>
//                     ))}
//                 </ul>

//                 <p className="text-red-600 font-semibold">
//                   Weaknesses
//                 </p>
//                 <ul className="list-disc ml-6">
//                   {Object.keys(skills)
//                     .filter((k) => skills[k] < 6)
//                     .map((k) => (
//                       <li key={k}>{k}</li>
//                     ))}
//                 </ul>
//               </div>
//             </div>

//             {/* Improvements */}
//             <div className="bg-white p-6 rounded shadow">
//               <h3 className="font-semibold mb-4">
//                 What Can Be Done To Improve?
//               </h3>

//               <ul className="list-disc ml-6 space-y-2">
//                 {improvements.length > 0 ? (
//                   improvements.map((tip, index) => (
//                     <li key={index}>{tip}</li>
//                   ))
//                 ) : (
//                   <li>Your profile is strong. Maintain consistency.</li>
//                 )}
//               </ul>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;













// import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import Home from "./Home";
// import Module2 from "./App1";

// function App() {

//   // ================= NAVIGATION STATE =================
//   const [page, setPage] = useState("home");

//   // ================= MODULE 1 STATES =================
//   const [mode, setMode] = useState("resume");
//   const [file, setFile] = useState(null);

//   const [profile, setProfile] = useState({
//     branch: "CSE",
//     cgpa: 7,
//     internships: 0,
//     projects: 0,
//     certifications: 0,
//   });

//   const [skills, setSkills] = useState({
//     programming: 6,
//     aptitude: 5,
//     communication: 5,
//     core_subjects: 5,
//   });

//   const [result, setResult] = useState(null);
//   const [analyzed, setAnalyzed] = useState(false);

//   // ================= Resume Analyze =================
//   const analyzeResume = async () => {
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("file", file);

//     const response = await axios.post(
//       "http://127.0.0.1:8000/predict",
//       formData
//     );

//     setProfile(response.data.profile);

//     setSkills({
//       programming: response.data.profile.programming,
//       aptitude: response.data.profile.aptitude,
//       communication: response.data.profile.communication,
//       core_subjects: response.data.profile.core_subjects,
//     });

//     setResult({
//       readiness: response.data.readiness_score,
//       probability: response.data.placement_probability,
//       status:
//         response.data.placement_probability > 75
//           ? "Likely Placed"
//           : response.data.placement_probability > 50
//           ? "Moderate Chance"
//           : "Needs Improvement",
//     });

//     setAnalyzed(true);
//   };

//   // ================= Manual Analyze =================
//   const analyzeManual = useCallback(async () => {
//     if (!profile) return;

//     const response = await axios.post(
//       "http://127.0.0.1:8000/predict_manual",
//       {
//         ...profile,
//         ...skills,
//       }
//     );

//     setResult({
//       readiness: response.data.readiness_score,
//       probability: response.data.placement_probability,
//       status:
//         response.data.placement_probability > 75
//           ? "Likely Placed"
//           : response.data.placement_probability > 50
//           ? "Moderate Chance"
//           : "Needs Improvement",
//     });

//     setAnalyzed(true);
//   }, [profile, skills]);

//   useEffect(() => {
//     if (analyzed && mode === "manual") {
//       analyzeManual();
//     }
//   }, [skills, analyzed, analyzeManual, mode]);

//   const statusColor =
//     result?.status === "Likely Placed"
//       ? "text-green-600"
//       : result?.status === "Moderate Chance"
//       ? "text-yellow-500"
//       : "text-red-600";

//   const improvements = [];

//   if (profile) {
//     if (profile.internships === 0)
//       improvements.push("Gain internship experience.");
//     if (profile.certifications === 0)
//       improvements.push("Complete relevant certifications.");
//     if (profile.projects < 2)
//       improvements.push("Build more technical projects.");
//     if (skills.aptitude < 6)
//       improvements.push("Improve aptitude skills.");
//     if (skills.programming < 6)
//       improvements.push("Improve programming skills.");
//     if (skills.communication < 6)
//       improvements.push("Improve communication skills.");
//   }

//   // ================= PAGE NAVIGATION =================
//   if (page === "home") {
//     return <Home setPage={setPage} />;
//   }

//   if (page === "module2") {
//     return <Module2 setPage={setPage} />;
//   }

//   // ================= MODULE 1 UI =================
//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <button
//         onClick={() => setPage("home")}
//         className="mb-4 bg-gray-200 px-4 py-2 rounded"
//       >
//         ← Back to Home
//       </button>

//       <div className="max-w-6xl mx-auto space-y-6">
//         {/* HEADER */}
//         <div className="bg-blue-700 text-white text-center p-6 rounded shadow">
//           <h1 className="text-2xl font-bold">
//             Placement Readiness & Probability Analyzer
//           </h1>
//         </div>

//         {/* MODE */}
//         <div className="bg-white p-4 rounded shadow flex gap-6">
//           <label>
//             <input
//               type="radio"
//               checked={mode === "resume"}
//               onChange={() => setMode("resume")}
//             /> Resume Upload
//           </label>

//           <label>
//             <input
//               type="radio"
//               checked={mode === "manual"}
//               onChange={() => setMode("manual")}
//             /> Manual Input
//           </label>
//         </div>

//         {/* RESUME */}
//         {mode === "resume" && (
//           <div className="bg-white p-6 rounded shadow flex gap-4">
//             <input
//               type="file"
//               onChange={(e) => setFile(e.target.files[0])}
//               className="flex-1"
//             />
//             <button
//               onClick={analyzeResume}
//               className="bg-blue-600 text-white px-6 py-2 rounded"
//             >
//               Analyze
//             </button>
//           </div>
//         )}

//         {/* MANUAL */}
//         {mode === "manual" && (
//           <div className="bg-white p-6 rounded shadow space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <select
//                 className="border p-2 rounded"
//                 onChange={(e) =>
//                   setProfile({ ...profile, branch: e.target.value })
//                 }
//               >
//                 <option value="CSE">CSE</option>
//                 <option value="IT">IT</option>
//                 <option value="ECE">ECE</option>
//                 <option value="Mechanical">Mechanical</option>
//               </select>

//               <input
//                 type="number"
//                 placeholder="CGPA"
//                 className="border p-2 rounded"
//                 onChange={(e) =>
//                   setProfile({
//                     ...profile,
//                     cgpa: Number(e.target.value),
//                   })
//                 }
//               />

//               <input
//                 type="number"
//                 placeholder="Internships"
//                 className="border p-2 rounded"
//                 onChange={(e) =>
//                   setProfile({
//                     ...profile,
//                     internships: Number(e.target.value),
//                   })
//                 }
//               />

//               <input
//                 type="number"
//                 placeholder="Projects"
//                 className="border p-2 rounded"
//                 onChange={(e) =>
//                   setProfile({
//                     ...profile,
//                     projects: Number(e.target.value),
//                   })
//                 }
//               />

//               <input
//                 type="number"
//                 placeholder="Certifications"
//                 className="border p-2 rounded"
//                 onChange={(e) =>
//                   setProfile({
//                     ...profile,
//                     certifications: Number(e.target.value),
//                   })
//                 }
//               />
//             </div>

//             <button
//               onClick={analyzeManual}
//               className="bg-blue-600 text-white px-6 py-2 rounded"
//             >
//               Analyze
//             </button>
//           </div>
//         )}

//         {/* RESULTS */}
//         {analyzed && result && (
//           <>
//             <div className="grid grid-cols-3 gap-6">
//               <div className="bg-white p-4 rounded shadow">
//                 <h3>Readiness Score</h3>
//                 <p className="text-2xl font-bold text-green-600">
//                   {result.readiness} / 100
//                 </p>
//               </div>

//               <div className="bg-white p-4 rounded shadow">
//                 <h3>Placement Probability</h3>
//                 <p className="text-2xl font-bold text-blue-600">
//                   {result.probability}%
//                 </p>
//               </div>

//               <div className="bg-white p-4 rounded shadow">
//                 <h3>Predicted Status</h3>
//                 <p className={`text-xl font-bold ${statusColor}`}>
//                   {result.status}
//                 </p>
//               </div>
//             </div>

//             {/* GRAPH */}
//             <div className="bg-white p-6 rounded shadow">
//               <h3 className="font-semibold mb-4">Skill Level Analysis</h3>

//               <div className="relative h-56 border-l border-b pl-4 pb-4">
//                 <div className="absolute left-0 bottom-0 h-full flex flex-col justify-between text-xs text-gray-500">
//                   <span>10</span>
//                   <span>8</span>
//                   <span>6</span>
//                   <span>4</span>
//                   <span>2</span>
//                   <span>0</span>
//                 </div>

//                 <div className="flex justify-around items-end h-full ml-6">
//                   {Object.keys(skills).map((key) => (
//                     <div key={key} className="flex flex-col items-center">
//                       <div
//                         className="bg-blue-600 w-12 rounded-t-md transition-all duration-300"
//                         style={{ height: `${skills[key] * 18}px` }}
//                       ></div>
//                       <span className="text-xs mt-2 capitalize">
//                         {key}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;






// import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import Home from "./Home";
// import Module1 from "./Module1";

// function App() {
//   const [page, setPage] = useState("home");

//   return (
//     <>
//       {page === "home" && <Home setPage={setPage} />}
//       {page === "module1" && <Module1 setPage={setPage} />}
//     </>
//   );
// }

// function Module1({ setPage }) {
//   const [mode, setMode] = useState("resume");
//   const [file, setFile] = useState(null);

//   const [profile, setProfile] = useState({
//     branch: "CSE",
//     cgpa: 7,
//     internships: 0,
//     projects: 0,
//     certifications: 0,
//   });

//   const [skills, setSkills] = useState({
//     programming: 6,
//     aptitude: 5,
//     communication: 5,
//     core_subjects: 5,
//   });

//   const [result, setResult] = useState(null);
//   const [analyzed, setAnalyzed] = useState(false);

//   const analyzeManual = useCallback(async () => {
//     const response = await axios.post(
//       "http://127.0.0.1:8000/predict_manual",
//       {
//         ...profile,
//         ...skills,
//       }
//     );

//     setResult({
//       readiness: response.data.readiness_score,
//       probability: response.data.placement_probability,
//       status:
//         response.data.placement_probability > 75
//           ? "Likely Placed"
//           : response.data.placement_probability > 50
//           ? "Moderate Chance"
//           : "Needs Improvement",
//     });

//     setAnalyzed(true);
//   }, [profile, skills]);

//   useEffect(() => {
//     if (analyzed && mode === "manual") {
//       analyzeManual();
//     }
//   }, [skills, analyzed, analyzeManual, mode]);

//   const statusColor =
//     result?.status === "Likely Placed"
//       ? "text-green-600"
//       : result?.status === "Moderate Chance"
//       ? "text-yellow-500"
//       : "text-red-600";

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <div className="max-w-6xl mx-auto space-y-6">

//         {/* HEADER */}
//         <div className="bg-blue-700 text-white text-center p-6 rounded shadow relative">
//           <button
//             onClick={() => setPage("home")}
//             className="absolute left-4 top-4 bg-white text-blue-700 px-3 py-1 rounded"
//           >
//             Back
//           </button>

//           <h1 className="text-2xl font-bold">
//             Placement Analyzer
//           </h1>
//           <p className="text-sm mt-2">
//             Placement Readiness & Probability Analyzer
//           </p>
//         </div>

//         {/* MODE */}
//         <div className="bg-white p-4 rounded shadow flex gap-6">
//           <label>
//             <input
//               type="radio"
//               checked={mode === "manual"}
//               onChange={() => setMode("manual")}
//             /> Manual Input
//           </label>
//         </div>

//         {/* MANUAL */}
//         {mode === "manual" && (
//           <div className="bg-white p-6 rounded shadow space-y-4">
//             <div className="grid grid-cols-2 gap-4">

//               <input
//                 type="number"
//                 placeholder="CGPA"
//                 className="border p-2 rounded"
//                 onChange={(e) =>
//                   setProfile({
//                     ...profile,
//                     cgpa: Number(e.target.value),
//                   })
//                 }
//               />

//               <input
//                 type="number"
//                 placeholder="Internships"
//                 className="border p-2 rounded"
//                 onChange={(e) =>
//                   setProfile({
//                     ...profile,
//                     internships: Number(e.target.value),
//                   })
//                 }
//               />

//               <input
//                 type="number"
//                 placeholder="Projects"
//                 className="border p-2 rounded"
//                 onChange={(e) =>
//                   setProfile({
//                     ...profile,
//                     projects: Number(e.target.value),
//                   })
//                 }
//               />

//               <input
//                 type="number"
//                 placeholder="Certifications"
//                 className="border p-2 rounded"
//                 onChange={(e) =>
//                   setProfile({
//                     ...profile,
//                     certifications: Number(e.target.value),
//                   })
//                 }
//               />

//             </div>

//             <button
//               onClick={analyzeManual}
//               className="bg-blue-600 text-white px-6 py-2 rounded"
//             >
//               Analyze
//             </button>
//           </div>
//         )}

//         {/* RESULTS */}
//         {analyzed && result && (
//           <>
//             {/* METRICS */}
//             <div className="grid grid-cols-3 gap-6">
//               <div className="bg-white p-4 rounded shadow text-center">
//                 <h3>Readiness Score</h3>
//                 <p className="text-3xl font-bold text-green-600">
//                   {result.readiness}
//                 </p>
//               </div>

//               <div className="bg-white p-4 rounded shadow text-center">
//                 <h3>Placement Probability</h3>
//                 <p className="text-3xl font-bold text-blue-600">
//                   {result.probability}%
//                 </p>
//               </div>

//               <div className="bg-white p-4 rounded shadow text-center">
//                 <h3>Status</h3>
//                 <p className={`text-xl font-bold ${statusColor}`}>
//                   {result.status}
//                 </p>
//               </div>
//             </div>

//             {/* GRAPH */}
//             <div className="bg-white p-6 rounded shadow">
//               <h3 className="font-semibold mb-4">
//                 Skill Level Analysis
//               </h3>

//               <div className="flex justify-around items-end h-56">
//                 {Object.keys(skills).map((key) => (
//                   <div key={key} className="flex flex-col items-center">
//                     <div
//                       className="w-12 rounded-t-lg bg-gradient-to-t from-blue-500 to-blue-300"
//                       style={{ height: `${skills[key] * 15}px` }}
//                     ></div>
//                     <span className="text-sm mt-2 capitalize">
//                       {key}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Module1;




// import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import Home from "./Home";

// function App() {
//   const [page, setPage] = useState("home");

//   // MODULE 1 STATES
//   const [profile, setProfile] = useState({
//     branch: "CSE",
//     cgpa: 7,
//     internships: 0,
//     projects: 0,
//     certifications: 0,
//   });

//   const [skills, setSkills] = useState({
//     programming: 6,
//     aptitude: 5,
//     communication: 5,
//     core_subjects: 5,
//   });

//   const [result, setResult] = useState(null);
//   const [analyzed, setAnalyzed] = useState(false);

//   // ANALYZE
//   const analyzeManual = useCallback(async () => {
//     const response = await axios.post(
//       "http://127.0.0.1:8000/predict_manual",
//       {
//         ...profile,
//         ...skills,
//       }
//     );

//     setResult({
//       readiness: response.data.readiness_score,
//       probability: response.data.placement_probability,
//       status:
//         response.data.placement_probability > 75
//           ? "Likely Placed"
//           : response.data.placement_probability > 50
//           ? "Moderate Chance"
//           : "Needs Improvement",
//     });

//     setAnalyzed(true);
//   }, [profile, skills]);

//   useEffect(() => {
//     if (analyzed && page === "module1") {
//       analyzeManual();
//     }
//   }, [skills]);

//   const statusColor =
//     result?.status === "Likely Placed"
//       ? "text-green-600"
//       : result?.status === "Moderate Chance"
//       ? "text-yellow-500"
//       : "text-red-600";

//   // HOME PAGE
//   if (page === "home") {
//     return <Home setPage={setPage} />;
//   }

//   // MODULE 1 PAGE
//   if (page === "module1") {
//     return (
//       <div className="min-h-screen bg-gray-100 p-8">
//         <div className="max-w-6xl mx-auto space-y-6">

//           {/* HEADER */}
//           <div className="bg-blue-700 text-white text-center p-6 rounded shadow relative">
//             <button
//               onClick={() => setPage("home")}
//               className="absolute left-4 top-4 bg-white text-blue-700 px-3 py-1 rounded"
//             >
//               Back
//             </button>

//             <h1 className="text-2xl font-bold">
//               Placement Analyzer
//             </h1>
//             <p className="text-sm mt-2">
//               Placement Readiness & Probability Analyzer
//             </p>
//           </div>

//           {/* INPUT */}
//           <div className="bg-white p-6 rounded shadow space-y-4">
//             <div className="grid grid-cols-2 gap-4">

//               <input
//                 type="number"
//                 placeholder="CGPA"
//                 className="border p-2 rounded"
//                 onChange={(e) =>
//                   setProfile({
//                     ...profile,
//                     cgpa: Number(e.target.value),
//                   })
//                 }
//               />

//               <input
//                 type="number"
//                 placeholder="Internships"
//                 className="border p-2 rounded"
//                 onChange={(e) =>
//                   setProfile({
//                     ...profile,
//                     internships: Number(e.target.value),
//                   })
//                 }
//               />

//               <input
//                 type="number"
//                 placeholder="Projects"
//                 className="border p-2 rounded"
//                 onChange={(e) =>
//                   setProfile({
//                     ...profile,
//                     projects: Number(e.target.value),
//                   })
//                 }
//               />

//               <input
//                 type="number"
//                 placeholder="Certifications"
//                 className="border p-2 rounded"
//                 onChange={(e) =>
//                   setProfile({
//                     ...profile,
//                     certifications: Number(e.target.value),
//                   })
//                 }
//               />

//             </div>

//             <button
//               onClick={analyzeManual}
//               className="bg-blue-600 text-white px-6 py-2 rounded"
//             >
//               Analyze
//             </button>
//           </div>

//           {/* RESULTS */}
//           {analyzed && result && (
//             <>
//               <div className="grid grid-cols-3 gap-6">
//                 <div className="bg-white p-4 rounded shadow text-center">
//                   <h3>Readiness Score</h3>
//                   <p className="text-3xl font-bold text-green-600">
//                     {result.readiness}
//                   </p>
//                 </div>

//                 <div className="bg-white p-4 rounded shadow text-center">
//                   <h3>Placement Probability</h3>
//                   <p className="text-3xl font-bold text-blue-600">
//                     {result.probability}%
//                   </p>
//                 </div>

//                 <div className="bg-white p-4 rounded shadow text-center">
//                   <h3>Status</h3>
//                   <p className={`text-xl font-bold ${statusColor}`}>
//                     {result.status}
//                   </p>
//                 </div>
//               </div>

//               {/* GRAPH */}
//               <div className="bg-white p-6 rounded shadow">
//                 <h3 className="font-semibold mb-4">
//                   Skill Level Analysis
//                 </h3>

//                 <div className="flex justify-around items-end h-56">
//                   {Object.keys(skills).map((key) => (
//                     <div key={key} className="flex flex-col items-center">
//                       <div
//                         className="w-12 rounded-t-lg bg-gradient-to-t from-blue-500 to-blue-300"
//                         style={{ height: `${skills[key] * 15}px` }}
//                       ></div>
//                       <span className="text-sm mt-2 capitalize">
//                         {key}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     );
//   }
// }

// export default App;







// import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import Home from "./Home";

// function App() {
//   const [page, setPage] = useState("home");

//   const [mode, setMode] = useState("resume");
//   const [file, setFile] = useState(null);

//   const [profile, setProfile] = useState({
//     branch: "CSE",
//     cgpa: 7,
//     internships: 0,
//     projects: 0,
//     certifications: 0,
//   });

//   const [skills, setSkills] = useState({
//     programming: 6,
//     aptitude: 5,
//     communication: 5,
//     core_subjects: 5,
//   });

//   const [result, setResult] = useState(null);
//   const [analyzed, setAnalyzed] = useState(false);

//   // ================= Resume Analyze =================
//   const analyzeResume = async () => {
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("file", file);

//     const response = await axios.post(
//       "http://127.0.0.1:8000/predict",
//       formData
//     );

//     setProfile(response.data.profile);

//     setSkills({
//       programming: response.data.profile.programming,
//       aptitude: response.data.profile.aptitude,
//       communication: response.data.profile.communication,
//       core_subjects: response.data.profile.core_subjects,
//     });

//     setResult({
//       readiness: response.data.readiness_score,
//       probability: response.data.placement_probability,
//       status:
//         response.data.placement_probability > 75
//           ? "Likely Placed"
//           : response.data.placement_probability > 50
//           ? "Moderate Chance"
//           : "Needs Improvement",
//     });

//     setAnalyzed(true);
//   };

//   // ================= Manual Analyze =================
//   const analyzeManual = useCallback(async () => {
//     if (!profile) return;

//     const response = await axios.post(
//       "http://127.0.0.1:8000/predict_manual",
//       {
//         ...profile,
//         ...skills,
//       }
//     );

//     setResult({
//       readiness: response.data.readiness_score,
//       probability: response.data.placement_probability,
//       status:
//         response.data.placement_probability > 75
//           ? "Likely Placed"
//           : response.data.placement_probability > 50
//           ? "Moderate Chance"
//           : "Needs Improvement",
//     });

//     setAnalyzed(true);
//   }, [profile, skills]);

//   useEffect(() => {
//     if (analyzed && mode === "manual") {
//       analyzeManual();
//     }
//   }, [skills, analyzed, analyzeManual, mode]);

//   const statusColor =
//     result?.status === "Likely Placed"
//       ? "text-green-600"
//       : result?.status === "Moderate Chance"
//       ? "text-yellow-500"
//       : "text-red-600";

//   const improvements = [];

//   if (profile) {
//     if (profile.internships === 0)
//       improvements.push("Gain internship experience.");
//     if (profile.certifications === 0)
//       improvements.push("Complete relevant certifications.");
//     if (profile.projects < 2)
//       improvements.push("Build more technical projects.");
//     if (skills.aptitude < 6)
//       improvements.push("Improve aptitude skills.");
//     if (skills.programming < 6)
//       improvements.push("Improve programming skills.");
//     if (skills.communication < 6)
//       improvements.push("Improve communication skills.");
//   }

//   // ================= HOME PAGE =================
//   if (page === "home") {
//     return <Home setPage={setPage} />;
//   }

//   // ================= MODULE 1 PAGE =================
//   if (page === "module1") {
//     return (
//       <div className="min-h-screen bg-gray-100 p-8">
//         <div className="max-w-6xl mx-auto space-y-6">

//           {/* Back Button */}
//           <button
//             onClick={() => setPage("home")}
//             className="bg-blue-600 text-white px-4 py-2 rounded"
//           >
//             Back to Home
//           </button>

//           {/* HEADER */}
//           <div className="bg-blue-700 text-white text-center p-6 rounded shadow">
//             <h1 className="text-2xl font-bold">
//               AI-Based Placement & Career Intelligence Platform
//             </h1>
//             <p className="text-sm mt-2">
//               Smart Placement Readiness & Probability Analyzer
//             </p>
//           </div>

//           {/* MODE */}
//           <div className="bg-white p-4 rounded shadow flex gap-6">
//             <label>
//               <input
//                 type="radio"
//                 checked={mode === "resume"}
//                 onChange={() => setMode("resume")}
//               /> Resume Upload
//             </label>

//             <label>
//               <input
//                 type="radio"
//                 checked={mode === "manual"}
//                 onChange={() => setMode("manual")}
//               /> Manual Input
//             </label>
//           </div>

//           {/* RESUME */}
//           {mode === "resume" && (
//             <div className="bg-white p-6 rounded shadow flex gap-4">
//               <input
//                 type="file"
//                 onChange={(e) => setFile(e.target.files[0])}
//                 className="flex-1"
//               />
//               <button
//                 onClick={analyzeResume}
//                 className="bg-blue-600 text-white px-6 py-2 rounded"
//               >
//                 Analyze
//               </button>
//             </div>
//           )}

//           {/* MANUAL */}
//           {mode === "manual" && (
//             <div className="bg-white p-6 rounded shadow space-y-4">
//               <div className="grid grid-cols-2 gap-4">

//                 <select
//                   className="border p-2 rounded"
//                   onChange={(e) =>
//                     setProfile({ ...profile, branch: e.target.value })
//                   }
//                 >
//                   <option value="CSE">CSE</option>
//                   <option value="IT">IT</option>
//                   <option value="ECE">ECE</option>
//                   <option value="Mechanical">Mechanical</option>
//                 </select>

//                 <input
//                   type="number"
//                   placeholder="CGPA"
//                   className="border p-2 rounded"
//                   onChange={(e) =>
//                     setProfile({
//                       ...profile,
//                       cgpa: Number(e.target.value),
//                     })
//                   }
//                 />

//                 <input
//                   type="number"
//                   placeholder="Internships"
//                   className="border p-2 rounded"
//                   onChange={(e) =>
//                     setProfile({
//                       ...profile,
//                       internships: Number(e.target.value),
//                     })
//                   }
//                 />

//                 <input
//                   type="number"
//                   placeholder="Projects"
//                   className="border p-2 rounded"
//                   onChange={(e) =>
//                     setProfile({
//                       ...profile,
//                       projects: Number(e.target.value),
//                     })
//                   }
//                 />

//                 <input
//                   type="number"
//                   placeholder="Certifications"
//                   className="border p-2 rounded"
//                   onChange={(e) =>
//                     setProfile({
//                       ...profile,
//                       certifications: Number(e.target.value),
//                     })
//                   }
//                 />

//               </div>

//               <button
//                 onClick={analyzeManual}
//                 className="bg-blue-600 text-white px-6 py-2 rounded"
//               >
//                 Analyze
//               </button>
//             </div>
//           )}

//           {/* RESULTS */}
//           {analyzed && result && (
//             <>
//               {/* Your entire result UI stays same */}
//               {/* (I did not change anything here) */}
//             </>
//           )}
//         </div>
//       </div>
//     );
//   }
// }

// export default App;













// import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import Home from "./Home";

// function App() {
//   const [page, setPage] = useState("home");

//   const [mode, setMode] = useState("manual");
//   const [profile, setProfile] = useState({
//     branch: "CSE",
//     cgpa: 7,
//     internships: 0,
//     projects: 0,
//     certifications: 0,
//   });

//   const [skills, setSkills] = useState({
//     programming: 6,
//     aptitude: 5,
//     communication: 5,
//     core_subjects: 5,
//   });

//   const [result, setResult] = useState(null);
//   const [analyzed, setAnalyzed] = useState(false);

//   const analyzeManual = async () => {
//     console.log("Analyze clicked");

//     try {
//       const response = await axios.post(
//         "http://127.0.0.1:8000/predict_manual",
//         {
//           ...profile,
//           ...skills,
//         }
//       );

//       setResult({
//         readiness: response.data.readiness_score,
//         probability: response.data.placement_probability,
//         status:
//           response.data.placement_probability > 75
//             ? "Likely Placed"
//             : response.data.placement_probability > 50
//             ? "Moderate Chance"
//             : "Needs Improvement",
//       });

//       setAnalyzed(true);
//     } catch (error) {
//       console.log(error);
//       alert("API Error");
//     }
//   };

//   const statusColor =
//     result?.status === "Likely Placed"
//       ? "text-green-600"
//       : result?.status === "Moderate Chance"
//       ? "text-yellow-500"
//       : "text-red-600";

//   return (
//     <>
//       {page === "home" && <Home setPage={setPage} />}

//       {page === "module1" && (
//         <div className="min-h-screen bg-gray-100 p-8">
//           <div className="max-w-6xl mx-auto space-y-6">

//             <button
//               onClick={() => setPage("home")}
//               className="bg-blue-600 text-white px-4 py-2 rounded"
//             >
//               Back to Home
//             </button>

//             {/* HEADER */}
//             <div className="bg-blue-700 text-white text-center p-6 rounded shadow">
//               <h1 className="text-2xl font-bold">
//                 AI-Based Placement & Career Intelligence Platform
//               </h1>
//               <p className="text-sm mt-2">
//                 Smart Placement Readiness & Probability Analyzer
//               </p>
//             </div>

//             {/* INPUT */}
//             <div className="bg-white p-6 rounded shadow space-y-4">
//               <div className="grid grid-cols-2 gap-4">

//                 <input
//                   type="number"
//                   placeholder="CGPA"
//                   className="border p-2 rounded"
//                   onChange={(e) =>
//                     setProfile({
//                       ...profile,
//                       cgpa: Number(e.target.value),
//                     })
//                   }
//                 />

//                 <input
//                   type="number"
//                   placeholder="Internships"
//                   className="border p-2 rounded"
//                   onChange={(e) =>
//                     setProfile({
//                       ...profile,
//                       internships: Number(e.target.value),
//                     })
//                   }
//                 />

//                 <input
//                   type="number"
//                   placeholder="Projects"
//                   className="border p-2 rounded"
//                   onChange={(e) =>
//                     setProfile({
//                       ...profile,
//                       projects: Number(e.target.value),
//                     })
//                   }
//                 />

//                 <input
//                   type="number"
//                   placeholder="Certifications"
//                   className="border p-2 rounded"
//                   onChange={(e) =>
//                     setProfile({
//                       ...profile,
//                       certifications: Number(e.target.value),
//                     })
//                   }
//                 />

//               </div>

//               <button
//                 onClick={analyzeManual}
//                 className="bg-blue-600 text-white px-6 py-2 rounded"
//               >
//                 Analyze
//               </button>
//             </div>

//             {/* RESULTS */}
//             {analyzed && result && (
//               <div className="grid grid-cols-3 gap-6">
//                 <div className="bg-white p-4 rounded shadow text-center">
//                   <h3>Readiness Score</h3>
//                   <p className="text-2xl font-bold text-green-600">
//                     {result.readiness}
//                   </p>
//                 </div>

//                 <div className="bg-white p-4 rounded shadow text-center">
//                   <h3>Placement Probability</h3>
//                   <p className="text-2xl font-bold text-blue-600">
//                     {result.probability}%
//                   </p>
//                 </div>

//                 <div className="bg-white p-4 rounded shadow text-center">
//                   <h3>Status</h3>
//                   <p className={`text-xl font-bold ${statusColor}`}>
//                     {result.status}
//                   </p>
//                 </div>
//               </div>
//             )}

//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default App;













import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Home from "./Home";

function App() {
  const [page, setPage] = useState("home");

  const [mode, setMode] = useState("resume");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    branch: "CSE",
    cgpa: 7,
    internships: 0,
    projects: 0,
    certifications: 0,
  });

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
        "http://127.0.0.1:8000/predict",
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
        "http://127.0.0.1:8000/predict_manual",
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
              onChange={(e) => setFile(e.target.files[0])}
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
              <div className="bg-white p-6 rounded shadow">
                <h3 className="font-semibold mb-4">
                  Skill Level Analysis
                </h3>

                <div className="flex justify-around items-end h-56 border-l border-b pl-4 pb-2">
                  {Object.keys(skills).map((key) => (
                    <div key={key} className="flex flex-col items-center w-16">
                      <span className="text-sm font-semibold mb-1">
                        {skills[key]}
                      </span>
                      <div className="w-10 bg-gray-200 rounded-t-lg flex items-end">
                        <div
                        className="w-10 rounded-t-lg bg-gradient-to-t from-blue-600 to-blue-300 transition-all duration-500"
                        style={{ height: `${skills[key] * 12}px` }}
                        ></div>
                      </div>
                      <span className="text-xs mt-2 capitalize text-center">
                        {key}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths Weakness */}
              <div className="bg-white p-6 rounded shadow">
                <h3 className="font-semibold mb-4">
                  Strengths & Weaknesses
                </h3>

                <p className="text-green-600 font-semibold">
                  Strengths
                </p>
                <ul className="list-disc ml-6 mb-4">
                  {Object.keys(skills)
                    .filter((k) => skills[k] >= 7)
                    .map((k) => (
                      <li key={k}>{k}</li>
                    ))}
                </ul>

                <p className="text-red-600 font-semibold">
                  Weaknesses
                </p>
                <ul className="list-disc ml-6">
                  {Object.keys(skills)
                    .filter((k) => skills[k] < 6)
                    .map((k) => (
                      <li key={k}>{k}</li>
                    ))}
                </ul>
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














