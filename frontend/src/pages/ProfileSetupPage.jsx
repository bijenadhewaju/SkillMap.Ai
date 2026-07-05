import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ProfileSetupPage = () => {
  const navigate = useNavigate();
  const [setupData, setSetupData] = useState({
    education: '',
    experience: 'Beginner',
    targetCareer: '',
    skills: ''
  });

  const handleChange = (e) => {
    setSetupData({ ...setupData, [e.target.name]: e.target.value });
  };

  const handleBuildRoadmap = (e) => {
    e.preventDefault();
    console.log('Generating AI map for:', setupData);
    // Move onto the customized course selection layout
    navigate('/roadmap');
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-soft">
      <Navbar />
      <main className="flex-grow-1 d-flex align-items-center justify-content-center pt-5 mt-5 pb-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="card border-0 shadow-sm rounded-3 p-4 bg-white">
                <div className="card-body">
                  <h3 className="fw-bold text-center text-brand mb-2">Build Your Career Profile</h3>
                  <p className="text-center text-secondary mb-4 small">Provide your current details to initialize your customized AI roadmap calculation.</p>

                  <form onSubmit={handleBuildRoadmap}>
                    <div className="mb-3">
                      <label className="form-label fw-medium text-dark small">Highest Level of Education</label>
                      <input type="text" className="form-control" name="education" value={setupData.education} onChange={handleChange} placeholder="e.g. BSc Computer Science, Self-Taught" required />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-medium text-dark small">Current Experience Level</label>
                      <select className="form-select" name="experience" value={setupData.experience} onChange={handleChange}>
                        <option value="Beginner">Beginner (No prior industry exposure)</option>
                        <option value="Intermediate">Intermediate (Some programming foundation)</option>
                        <option value="Advanced">Advanced (Looking to upskill or switch domains)</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-medium text-dark small">Target Tech Career</label>
                      <input type="text" className="form-control" name="targetCareer" value={setupData.targetCareer} onChange={handleChange} placeholder="e.g. Full Stack Developer, Data Scientist" required />
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-medium text-dark small">Current Technical Skills (Comma-separated)</label>
                      <textarea className="form-control" name="skills" rows="2" value={setupData.skills} onChange={handleChange} placeholder="e.g. Python, HTML, Git (Leave blank if starting fresh)"></textarea>
                    </div>

                    <button type="submit" className="btn btn-brand w-100 py-2 fw-semibold">
                      Generate Interactive Roadmap
                    </button>
                  </form>
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

export default ProfileSetupPage;