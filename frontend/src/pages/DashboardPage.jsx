import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const DashboardPage = () => {
  // MOCK DATA: We will replace this with a real Django API call later
  const userData = {
    name: "Rajamati",
    title: "Aspiring Full Stack Developer",
    education: "BSc Computer Science",
    experience: "Beginner",
  };

  const currentSkills = ["Python", "React", "JavaScript", "Git"];
  const targetCareer = "Full Stack Developer";
  const missingSkills = ["Django", "PostgreSQL", "Docker"];

  const roadmap = [
    { id: 1, title: "Master Backend with Django", type: "Course", status: "In Progress" },
    { id: 2, title: "Build a REST API", type: "Project", status: "Pending" },
    { id: 3, title: "Database Design with PostgreSQL", type: "Course", status: "Pending" },
    { id: 4, title: "Containerize with Docker", type: "Project", status: "Pending" }
  ];

  return (
    <div className="d-flex flex-column min-vh-100 bg-soft">
      <Navbar />

      <main className="flex-grow-1 pt-5 mt-5 pb-5">
        <div className="container">

          <div className="row mb-4">
            <div className="col-12">
              <h2 className="fw-bold text-dark">Welcome back, {userData.name}! 👋</h2>
              <p className="text-secondary">Here is your personalized skill map and learning progress.</p>
            </div>
          </div>

          <div className="row g-4">
            {/* LEFT COLUMN: Profile & Current Skills */}
            <div className="col-lg-4">

              {/* Profile Card */}
              <div className="card border-0 shadow-sm rounded-3 mb-4 bg-white">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-brand-dark text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-4" style={{width: '60px', height: '60px'}}>
                      {userData.name.charAt(0)}
                    </div>
                    <div className="ms-3">
                      <h5 className="fw-bold mb-0">{userData.name}</h5>
                      <span className="badge bg-light text-dark border mt-1">{userData.experience}</span>
                    </div>
                  </div>
                  <hr className="text-muted" />
                  <p className="small text-secondary mb-1"><strong>Education:</strong> {userData.education}</p>
                  <p className="small text-secondary mb-0"><strong>Target:</strong> {userData.title}</p>
                  <button className="btn btn-outline-brand btn-sm w-100 mt-3">Edit Profile</button>
                </div>
              </div>

              {/* Current Skills Card */}
              <div className="card border-0 shadow-sm rounded-3 bg-white">
                <div className="card-body p-4">
                  <h6 className="fw-bold mb-3">My Current Skills</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {currentSkills.map((skill, index) => (
                      <span key={index} className="badge bg-light text-dark border px-3 py-2 rounded-pill fw-normal">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <button className="btn btn-link text-brand text-decoration-none small p-0 mt-3 w-100 text-start">
                    + Add New Skill
                  </button>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: AI Analysis & Roadmap */}
            <div className="col-lg-8">

              {/* AI Skill Gap Analysis */}
              <div className="card border-0 shadow-sm rounded-3 mb-4 bg-white">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold mb-0 text-brand">🤖 AI Skill Gap Analysis</h5>
                    <span className="badge bg-soft text-brand border border-primary">Target: {targetCareer}</span>
                  </div>

                  <div className="p-3 bg-soft rounded-3 border border-danger border-opacity-25">
                    <h6 className="fw-bold text-danger mb-2">Missing Competencies Identified</h6>
                    <p className="small text-secondary mb-3">Based on industry requirements for a {targetCareer}, our AI suggests you need to acquire the following skills:</p>
                    <div className="d-flex flex-wrap gap-2">
                      {missingSkills.map((skill, index) => (
                        <span key={index} className="badge bg-danger bg-opacity-10 text-danger border border-danger px-3 py-2 rounded-pill fw-normal">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Personalized Roadmap */}
              <div className="card border-0 shadow-sm rounded-3 bg-white">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4 text-brand">🗺️ Your Learning Roadmap</h5>

                  <div className="roadmap-timeline">
                    {roadmap.map((step) => (
                      <div key={step.id} className="d-flex mb-3 align-items-start p-3 border rounded-3 hover-shadow-sm transition-all">
                        <div className={`me-3 mt-1 ${step.status === 'In Progress' ? 'text-warning' : 'text-secondary'}`}>
                          {step.status === 'In Progress' ? '⏳' : '⭕'}
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="fw-bold mb-1">{step.title}</h6>
                          <div className="d-flex align-items-center gap-2 mt-1">
                            <span className={`badge ${step.type === 'Course' ? 'bg-primary' : 'bg-success'} bg-opacity-10 text-dark border px-2 py-1 small fw-normal`}>
                              {step.type}
                            </span>
                            <span className="small text-muted">• {step.status}</span>
                          </div>
                        </div>
                        <button className="btn btn-brand btn-sm px-3 py-1">View</button>
                      </div>
                    ))}
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DashboardPage;