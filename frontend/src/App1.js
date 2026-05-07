import React, { useState, useEffect } from "react";
import axios from "axios";

function OpportunityFinder({ setPage, setSelectedCompanyData ,setGlobalResume, globalResume}) {
useEffect(() => {
    if (globalResume) {
      setFile(globalResume);
    }
  }, [globalResume]);
  // ================= STATES =================
  const [mode, setMode] = useState("resume");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [profile, setProfile] = useState({
    branch: "CSE",
    cgpa: 7,
    programming: 6,
    aptitude: 5,
    communication: 5,
    core_subjects: 5,
  });
  
  const [results, setResults] = useState([]);

  const [searchRole, setSearchRole] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All");

  // ================= HELPERS =================
  // Extract skills array
const getJobSkillsArray = (skills) => {
  return skills.toLowerCase().split(",").map(s => s.trim());
};

// Missing skills
const getMissingSkills = (job, profile) => {
  if (!job) return [];
  const jobSkills = getJobSkillsArray(job.skills);

  const userSkills = [];
  if (profile.programming >= 6) userSkills.push("python");
  if (profile.aptitude >= 6) userSkills.push("dsa");
  if (profile.communication >= 6) userSkills.push("communication");
  if (profile.core_subjects >= 6) userSkills.push("core");

  return jobSkills.filter(skill => !userSkills.includes(skill));
};

// Readiness score (simple formula)
const getReadinessScore = (job, profile) => {
  if (!job) return 0; 
  let score = job.match_score;

  if (profile.cgpa >= 8) score += 5;
  if (profile.programming >= 7) score += 5;

  return Math.min(score, 100);
};

// Roadmap generator
const getRoadmap = (missingSkills) => {
  const roadmap = [];

  missingSkills.forEach(skill => {
    skill = skill.toLowerCase();

    if (skill.includes("sql")) {
      roadmap.push("Learn SQL basics (SELECT, JOIN, GROUP BY)");
      roadmap.push("Practice SQL on HackerRank / LeetCode");
      roadmap.push("Build a mini database project");
    }

    else if (skill.includes("python")) {
      roadmap.push("Revise Python fundamentals");
      roadmap.push("Practice problem-solving in Python");
      roadmap.push("Build 1-2 mini projects");
    }

    else if (skill.includes("react")) {
      roadmap.push("Learn React basics (components, hooks)");
      roadmap.push("Build small UI projects");
      roadmap.push("Create a full-stack app with React");
    }

    else if (skill.includes("node")) {
      roadmap.push("Learn Node.js basics and Express");
      roadmap.push("Build REST APIs");
      roadmap.push("Connect backend with database");
    }

    else if (skill.includes("java")) {
      roadmap.push("Revise Java fundamentals and OOP");
      roadmap.push("Practice DSA using Java");
      roadmap.push("Build backend projects");
    }

    else if (skill.includes("c++")) {
      roadmap.push("Strengthen C++ fundamentals");
      roadmap.push("Practice DSA in C++");
      roadmap.push("Solve competitive programming problems");
    }

    else if (skill.includes("dsa") || skill.includes("data structures") || skill.includes("algorithms")) {
      roadmap.push("Learn core DSA concepts (arrays, trees, graphs)");
      roadmap.push("Solve problems on LeetCode daily");
      roadmap.push("Focus on interview patterns");
    }

    else if (skill.includes("deep learning")) {
      roadmap.push("Learn neural networks and backpropagation");
      roadmap.push("Use TensorFlow / PyTorch");
      roadmap.push("Build image or NLP models");
    }

    else if (skill.includes("nlp")) {
      roadmap.push("Learn NLP basics (tokenization, embeddings)");
      roadmap.push("Use libraries like NLTK / spaCy");
      roadmap.push("Build text classification or chatbot");
    }

    else if (skill.includes("cloud")) {
      roadmap.push("Learn cloud basics (AWS/Azure)");
      roadmap.push("Understand deployment and hosting");
      roadmap.push("Deploy a full-stack project");
    }

    else if (skill.includes("docker")) {
      roadmap.push("Learn Docker basics and containers");
      roadmap.push("Containerize an application");
      roadmap.push("Understand deployment workflows");
    }

    else if (skill.includes("linux")) {
      roadmap.push("Learn Linux commands and file system");
      roadmap.push("Practice shell scripting basics");
      roadmap.push("Use Linux for development workflows");
    }

    else if (skill.includes("statistics")) {
      roadmap.push("Revise probability and statistics basics");
      roadmap.push("Understand distributions and hypothesis testing");
      roadmap.push("Apply stats in ML problems");
    }

    else if (skill.includes("rest")) {
      roadmap.push("Learn REST API principles");
      roadmap.push("Build APIs using Express/FastAPI");
      roadmap.push("Test APIs using Postman");
    }

    else {
      roadmap.push(`Learn ${skill}`);
      roadmap.push(`Practice ${skill} with projects`);
    }
  });

  return roadmap;
};
  const getExplanation = (job, profile) => {
    const reasons = [];
    const jobSkills = job.skills.toLowerCase().split(",");

    if (profile.programming >= 6 && jobSkills.includes("python"))
      reasons.push("Matches your programming skills");

    if (profile.aptitude >= 6 && jobSkills.includes("dsa"))
      reasons.push("Strong aptitude (DSA) fit");

    if (profile.communication >= 6 && jobSkills.includes("communication"))
      reasons.push("Good communication skills match");

    if (profile.core_subjects >= 6 && jobSkills.includes("core"))
      reasons.push("Core subject knowledge matches");

    if (profile.cgpa >= 7)
      reasons.push("Meets CGPA requirement");

    if (profile.branch)
      reasons.push(`Relevant for ${profile.branch} students`);

    return reasons;
  };
  const companyAbout = {
  Accenture: "A global professional services company specializing in IT services and consulting. It provides solutions in strategy, digital, technology, and operations. Known for working with Fortune 500 clients across industries. Strong presence in cloud, AI, and cybersecurity services.",

  Adobe: "A leading software company known for creative and digital media tools. Popular products include Photoshop, Illustrator, and Adobe Acrobat. Focuses on creativity, marketing, and document solutions. Strong player in digital experience and cloud services.",

  Amazon: "One of the world’s largest e-commerce and cloud computing companies. Offers services like Amazon Web Services (AWS), Prime, and Alexa. Known for innovation in logistics, AI, and customer experience. Operates globally with a massive product and service ecosystem.",

  Capgemini: "A global consulting and technology services company. Provides services in digital transformation, cloud, and engineering. Works across industries like finance, telecom, and healthcare. Strong focus on innovation and sustainability.",

  Cisco: "A multinational company specializing in networking hardware and software. Known for routers, switches, and cybersecurity solutions. Plays a key role in internet infrastructure worldwide. Also expanding into cloud and collaboration tools.",

  Deloitte: "One of the Big Four accounting and consulting firms. Offers audit, consulting, tax, and advisory services. Works with large enterprises and governments globally. Known for strong business consulting and analytics.",

  Flipkart: "A leading Indian e-commerce platform owned by Walmart. Offers a wide range of products from electronics to fashion. Known for big sales like Big Billion Days. Competes directly with Amazon in India.",

  Google: "A global tech giant specializing in internet services and products. Known for search engine, Android, YouTube, and Google Cloud. Leader in AI, data, and advertising technologies. Part of Alphabet Inc.",

  IBM: "A multinational company focusing on enterprise technology solutions. Known for cloud computing, AI (Watson), and consulting services. Strong legacy in hardware and research innovation. Serves large organizations and governments.",

  Infosys: "A leading Indian IT services and consulting company. Provides software development, outsourcing, and digital services. Works with global clients across multiple industries. Known for strong training and employee development.",

  Intel: "A global leader in semiconductor and processor manufacturing. Known for CPUs used in laptops, desktops, and servers. Focuses on AI, cloud, and chip innovation. Key player in computing hardware industry.",

  Microsoft: "A global tech giant known for software and cloud services. Popular products include Windows, Office, and Azure. Strong focus on AI, enterprise solutions, and gaming (Xbox). One of the most valuable companies in the world.",

  NVIDIA: "A leading company in graphics processing units (GPUs). Known for gaming GPUs and AI computing hardware. Plays a major role in deep learning and data centers. Rapid growth due to AI and machine learning demand.",

  Oracle: "Specializes in database software and enterprise solutions. Offers cloud infrastructure and business applications. Widely used by large organizations for data management. Strong competitor in enterprise cloud services.",

  Paytm: "A popular digital payments and financial services platform in India. Offers UPI, wallet, banking, and ticket booking services. Played a major role in India’s digital payment revolution. Expanding into financial and merchant services.",

  Samsung: "A global leader in consumer electronics and smartphones. Produces TVs, phones, semiconductors, and appliances. Known for innovation in display and chip technology. Strong global market presence.",

  TCS: "India’s largest IT services and consulting company. Part of the Tata Group. Provides software development, cloud, and business solutions. Known for stability and large-scale global projects.",

  Uber: "A global ride-sharing and mobility platform. Offers services like Uber rides and food delivery (Uber Eats). Operates in many countries worldwide. Focuses on convenience and digital transportation.",

  Wipro: "A major Indian IT services and consulting company. Provides digital transformation, cloud, and cybersecurity services. Works with global clients across industries. Known for steady growth and innovation.",

  Zomato: "A leading food delivery and restaurant discovery platform. Operates in multiple countries with strong presence in India. Offers online ordering, reviews, and dining services. Competes with Swiggy in the Indian market."
};



  
  // 🎨 Dynamic bar color
  const getBarColor = (score) => {
    if (score >= 80) return "bg-green-600";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Avatar fallback
  const getAvatar = (company) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(company)}&background=2563eb&color=fff&bold=true`;
  };

  // OPTIONAL REAL LOGOS (you can add manually)
  const companyLogos = {
    Google: "/logos/google.png",
    Amazon: "/logos/amazon.png",
    Microsoft: "/logos/microsoft.png",
    Infosys: "/logos/infosys.png",
    Wipro: "/logos/wipro.png",
    Zomato: "/logos/zomato.png",
    Capgemini: "/logos/capgemini.png",
    Cisco: "/logos/cisco.png",
    Deloitte: "/logos/deloitte.png",
    Flipkart: "/logos/flipcart.png",
    IBM: "/logos/IBM.png",
    Intel: "/logos/intel.png",
    Nvidia: "/logos/nvidia.png",
    Oracle: "/logos/oracle.png",
    Paytm: "/logos/paytm.png",
    Samsung: "/logos/samsung.png",
    TCS: "logos/tcs.png",
    Uber: "logos/uber.png",
    Accenture: "/logos/accenture.png",
    Adobe: "/logos/adobe.png"
  };

  // ================= FILTER =================

  const locations = [
    "All",
    ...new Set(results.map((job) => job.location)),
  ];

  const filteredResults = results.filter((job) => {
    const roleMatch = job.role
      .toLowerCase()
      .includes(searchRole.toLowerCase());

    const locationMatch =
      selectedLocation === "All" ||
      job.location === selectedLocation;

    return roleMatch && locationMatch;
  });

  // ================= API =================
  
  const analyzeAndRecommend = async () => {
    if (!file) {
      alert("Upload resume first");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res1 = await axios.post(
        "http://127.0.0.1:8000/predict",
        formData
      );

      const extractedProfile = res1.data.profile;

      const res2 = await axios.post(
        "http://127.0.0.1:8000/recommend",
        extractedProfile
      );

      setResults([...res2.data].sort(() => Math.random() - 0.5));
    } catch (error) {
      console.log(error);
      alert("Error processing resume");
    }

    setLoading(false);
  };

  const manualRecommend = async () => {
    setLoading(true);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/recommend",
        profile
      );

      setResults(res.data);
    } catch (error) {
      console.log(error);
      alert("Error fetching recommendations");
    }

    setLoading(false);
  };

  // ================= UI =================

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
 
        {/* BACK */}
        <button
          onClick={() => setPage("home")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Back to Home
        </button>

        {/* HEADER */}
        <div className="bg-blue-700 text-white text-center p-6 rounded shadow">
          <h1 className="text-2xl font-bold">Opportunity Finder</h1>
          <p className="text-sm mt-2">
            AI-Powered Internship & Job Finder Platform
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
                setGlobalResume(e.target.files[0]);   // 🔥 THIS FIXES EVERYTHING
              }}
              className="flex-1"
            />
            <button
              onClick={analyzeAndRecommend}
              className="bg-blue-600 text-white px-6 py-2 rounded"
            >
              {loading ? "Processing..." : "Upload & Find"}
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
                  setProfile({ ...profile, cgpa: Number(e.target.value) })
                }
              />

              <input
                type="number"
                placeholder="Programming"
                className="border p-2 rounded"
                onChange={(e) =>
                  setProfile({ ...profile, programming: Number(e.target.value) })
                }
              />

              <input
                type="number"
                placeholder="Aptitude"
                className="border p-2 rounded"
                onChange={(e) =>
                  setProfile({ ...profile, aptitude: Number(e.target.value) })
                }
              />

              <input
                type="number"
                placeholder="Communication"
                className="border p-2 rounded"
                onChange={(e) =>
                  setProfile({ ...profile, communication: Number(e.target.value) })
                }
              />

              <input
                type="number"
                placeholder="Core Subjects"
                className="border p-2 rounded"
                onChange={(e) =>
                  setProfile({ ...profile, core_subjects: Number(e.target.value) })
                }
              />
            </div>

            <button
              onClick={manualRecommend}
              className="bg-blue-600 text-white px-6 py-2 rounded"
            >
              {loading ? "Finding..." : "Find Opportunities"}
            </button>
          </div>
        )}

        {/* FILTERS */}
        {results.length > 0 && (
          <div className="bg-white p-4 rounded shadow flex gap-4">

            <input
              type="text"
              placeholder="Search by role..."
              className="border p-2 rounded w-1/2"
              value={searchRole}
              onChange={(e) => setSearchRole(e.target.value)}
            />

            <select
              className="border p-2 rounded"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              {locations.map((loc, i) => (
                <option key={i}>{loc}</option>
              ))}
            </select>

          </div>
        )}

        {/* RESULTS */}
{/* RESULTS */}
{filteredResults.length > 0 && (
  <div className="space-y-6">

    {filteredResults.map((job, index) => {
      const reasons = getExplanation(job, profile);

      return (
        <div
          key={index}
          onClick={() => setSelectedJob(job)}
          className="bg-white p-6 rounded-xl shadow flex items-center relative hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >

          {/* TOP MATCH - extreme right */}
          {index === 0 && (
            <span className="absolute top-3 right-4 bg-green-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
              Top Match
            </span>
          )}

          {/* LEFT - LOGO */}
          <div className="w-[10%] flex justify-center items-center">
            <img
              src={companyLogos[job.company] || getAvatar(job.company)}
              alt={job.company}
              className="w-20 h-20 object-contain"
            />
          </div>

          {/* CENTER - JOB INFO */}
          <div className="w-3/6 pr-6">
            <h3 className="text-xl font-bold text-blue-700">
              {job.role}
            </h3>

            <p className="text-gray-600">{job.company}</p>
            <p className="text-sm text-gray-500">{job.location}</p>

            <div className="mt-3 w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${getBarColor(job.match_score)} transition-all duration-500`}
                style={{ width: `${job.match_score}%` }}
              ></div>
            </div>

            <p className="text-sm mt-2">
              <b>Match Score:</b> {job.match_score}% | Skills: {job.skills}
            </p>
          </div>

          {/* RIGHT - WHY + APPLY SIDE BY SIDE */}
          <div className="w-2/6 flex items-center justify-between gap-4">

            {/* WHY THIS JOB */}
            <div className="text-sm text-gray-600">
              <b>Why this job?</b>
              <ul className="list-disc ml-5 mt-1">
                {reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
            


            {/* APPLY BUTTON */}
            <a
              href={job.apply_link}
              target="_blank"
              rel="noreferrer"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition whitespace-nowrap"
            >
              Apply Now →
            </a>

          </div>

        </div>
      );
    })}

  </div>
)}
{/* ================= MODAL (STEP 2) ================= */}
{/* ================= FINAL CLEAN MODAL ================= */}
{selectedJob && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">

    <div className="bg-white w-[90%] max-w-5xl max-h-[85vh] overflow-y-auto p-8 pb-12 rounded-xl shadow-lg relative">

      {/* CLOSE */}
      <button
        onClick={() => setSelectedJob(null)}
        className="absolute top-4 right-4 text-gray-500 text-xl"
      >
        ✕
      </button>

      
      {/* HEADER */}
      <div className="flex items-center gap-6">
        <img
          src={companyLogos[selectedJob.company] || getAvatar(selectedJob.company)}
          alt={selectedJob.company}
          className="w-20 h-20 object-contain"
        />

        <div>
          <h2 className="text-2xl font-bold text-blue-700">
            {selectedJob.role}
          </h2>
          <p className="text-gray-600">{selectedJob.company}</p>
          <p className="text-sm text-gray-500">{selectedJob.location}</p>
        </div>
      </div>

      {/* MATCH BAR */}
      <div className="mt-6">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full ${getBarColor(selectedJob.match_score)} transition-all duration-500`}
            style={{ width: `${selectedJob.match_score}%` }}
          ></div>
        </div>

        <p className="mt-2 text-sm">
          <b>Match Score:</b> {selectedJob.match_score}% | Skills: {selectedJob.skills}
        </p>
      </div>

      {/* WHY + APPLY */}
      <div className="mt-6 flex justify-between items-start">

        <div className="text-gray-600 w-2/3">
          <p className="font-semibold mb-2">Why this job?</p>
          <ul className="list-disc ml-5">
            {getExplanation(selectedJob, profile).map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>

        <a
          href={selectedJob.apply_link}
          target="_blank"
          rel="noreferrer"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Apply Now →
        </a>

      </div>

      {/* GRID SECTION */}
      <div className="mt-8 grid grid-cols-2 gap-6">

        {/* MISSING SKILLS */}
        <div className="border p-5 rounded-lg">
          <p className="font-semibold mb-2">Missing Skills</p>
          <ul className="list-disc ml-5 text-sm text-gray-600">
            {getMissingSkills(selectedJob, profile).map((skill, i) => (
              <li key={i}>{skill}</li>
            ))}
          </ul>
        </div>

        {/* ROADMAP */}
        <div className="border p-5 rounded-lg flex flex-col justify-between">
          <div>
            <p className="font-semibold mb-2">Roadmap</p>
            <ul className="list-disc ml-5 text-sm text-gray-600">
              {getRoadmap(getMissingSkills(selectedJob, profile)).map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
          </div>

          <button
            className="mt-4 bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 self-start"
            onClick={() => {
              setSelectedCompanyData(selectedJob);
              setPage("module3");
            }}
          >
            Deep Analysis →
          </button>
        </div>

      </div>

      {/* READINESS SCORE (SEPARATE) */}
      <div className="mt-8 flex justify-center">
        <div className="border p-6 rounded-lg text-center w-60">
          <p className="text-sm text-gray-500">Readiness Score</p>
          <p className="text-3xl font-bold text-blue-700">
            {getReadinessScore(selectedJob, profile)}%
          </p>
        </div>
      </div>

      {/* ABOUT COMPANY */}
      <div className="mt-10 border-t pt-6">
        <p className="font-semibold mb-2">About Company</p>
        <p className="text-sm text-gray-600">
          {companyAbout[selectedJob.company] || "No information available."}
        </p>
      </div>

    </div>
  </div>
)}
      </div>
    </div>
  );
}

export default OpportunityFinder;





