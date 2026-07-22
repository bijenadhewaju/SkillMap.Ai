import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api';

const ProfileSetupPage = () => {
  const navigate = useNavigate();

  const [availableCareers, setAvailableCareers] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);

  const [experience, setExperience] = useState({ years: 0, previousRole: '' });
  const [educations, setEducations] = useState([
    { id: Date.now(), degree_level: '', stream: '', status: 'Completed', timeline: '' }
  ]);
  const [targetCareer, setTargetCareer] = useState('');
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    const fetchDropdownData = async () => {
        try {
            const [careersRes, skillsRes] = await Promise.all([
                api.get('/api/careers/'),
                api.get('/api/skills/')
            ]);
            setAvailableCareers(careersRes.data);
            setAvailableSkills(skillsRes.data);
        } catch (error) {
            console.error("Failed to fetch skills or careers", error);
        }
    };
    fetchDropdownData();
  }, []);

  const handleAddEducation = () => setEducations([...educations, { id: Date.now(), degree_level: '', stream: '', status: 'Completed', timeline: '' }]);
  const handleRemoveEducation = (id) => setEducations(educations.filter(edu => edu.id !== id));
  const handleEducationChange = (id, field, value) => setEducations(educations.map(edu => edu.id === id ? { ...edu, [field]: value } : edu));

  const handleAddSkill = (skillObj) => {
    if (!skills.find(s => s.id === skillObj.id)) setSkills([...skills, skillObj]);
    setSkillInput('');
  };
  const handleRemoveSkill = (id) => setSkills(skills.filter(skill => skill.id !== id));

  const filteredAvailableSkills = availableSkills.filter(skill =>
    skill.name.toLowerCase().includes(skillInput.toLowerCase()) && !skills.find(s => s.id === skill.id)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalData = {
      target_career: parseInt(targetCareer),
      educations: educations,
      skills: skills.map(skill => skill.id)
    };

    try {
      await api.patch('/api/accounts/profile/', finalData);
      localStorage.removeItem('userRoadmap');
      navigate('/roadmap');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save. Please try again.');
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-soft">
      <Navbar />
      <main className="flex-grow-1 pt-5 mt-5 pb-5">
        <div className="container py-4">

          <div className="mb-4">
            <h2 className="fw-bold text-brand">Profile Setup</h2>
            <p className="text-secondary">Tell us where you are now, so we can map out where you're going.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row g-4">

              {/* LEFT COLUMN: BACKGROUND */}
              <div className="col-lg-6">
                <div className="card border-0 shadow-sm bg-white h-100 p-4">
                  <h5 className="fw-bold text-brand mb-4 pb-2 border-bottom">1. Your Background</h5>

                  {/* Experience */}
                  <div className="row g-3 mb-4">
                    <div className="col-sm-6">
                      <label className="form-label small fw-medium text-dark">Years of Experience</label>
                      <select className="form-select bg-soft border-0" value={experience.years} onChange={(e) => setExperience({...experience, years: parseInt(e.target.value)})}>
                        <option value={0}>0 Years (Fresher)</option>
                        <option value={1}>1 Year</option>
                        <option value={2}>2 Years</option>
                        <option value={3}>3+ Years</option>
                      </select>
                    </div>
                    {experience.years > 0 && (
                      <div className="col-sm-6">
                        <label className="form-label small fw-medium text-dark">Current/Past Role</label>
                        <input type="text" className="form-control bg-soft border-0" placeholder="e.g. Sales Intern" value={experience.previousRole} onChange={(e) => setExperience({...experience, previousRole: e.target.value})} required={experience.years > 0} />
                      </div>
                    )}
                  </div>

                  {/* Education */}
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label small fw-medium text-dark mb-0">Highest Education</label>
                    <button type="button" className="btn btn-link text-brand p-0 text-decoration-none small fw-medium" onClick={handleAddEducation}>+ Add Another</button>
                  </div>

                  {educations.map((edu) => (
                    <div key={edu.id} className="row g-2 mb-3 position-relative p-3 bg-soft">
                      {educations.length > 1 && (
                        <button type="button" className="btn-close position-absolute top-0 end-0 mt-2 me-2" style={{fontSize: '0.5rem'}} onClick={() => handleRemoveEducation(edu.id)}></button>
                      )}
                      <div className="col-6">
                        <input type="text" className="form-control form-control-sm bg-white border-0" placeholder="Degree (e.g. B.Tech)" value={edu.degree_level} onChange={(e) => handleEducationChange(edu.id, 'degree_level', e.target.value)} required />
                      </div>
                      <div className="col-6">
                        <input type="text" className="form-control form-control-sm bg-white border-0" placeholder="Stream (e.g. CS)" value={edu.stream} onChange={(e) => handleEducationChange(edu.id, 'stream', e.target.value)} required />
                      </div>
                      <div className="col-6">
                        <select className="form-select form-select-sm bg-white border-0" value={edu.status} onChange={(e) => handleEducationChange(edu.id, 'status', e.target.value)}>
                          <option value="Completed">Completed</option>
                          <option value="Ongoing">Ongoing</option>
                        </select>
                      </div>
                      <div className="col-6">
                        <input type="text" className="form-control form-control-sm bg-white border-0" placeholder="Year / Semester" value={edu.timeline} onChange={(e) => handleEducationChange(edu.id, 'timeline', e.target.value)} required />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT COLUMN: GOALS & SKILLS */}
              <div className="col-lg-6">
                <div className="card border-0 shadow-sm bg-white h-100 p-4">
                  <h5 className="fw-bold text-brand mb-4 pb-2 border-bottom">2. Your Goals & Skills</h5>

                  {/* Target Career */}
                  <div className="mb-4">
                    <label className="form-label small fw-medium text-dark">Target Career</label>
                    <select className="form-select bg-soft border-0" value={targetCareer} onChange={(e) => setTargetCareer(e.target.value)} required>
                      <option value="" disabled>Select your dream role...</option>
                      {availableCareers.map((career) => (
                        <option key={career.id} value={career.id}>{career.title}</option>
                      ))}
                    </select>
                  </div>

                  {/* Skills */}
                  <div className="mb-4">
                    <label className="form-label small fw-medium text-dark">Current Technical Skills</label>
                    <div className="border-0 bg-soft p-2 d-flex flex-wrap gap-2 mb-2" style={{minHeight: '45px'}}>
                      {skills.map((skill) => (
                        <span key={skill.id} className="skill-badge px-2 py-1 d-flex align-items-center fw-normal">
                          {skill.name}
                          <span className="ms-2 text-muted" style={{cursor: 'pointer'}} onClick={() => handleRemoveSkill(skill.id)}>×</span>
                        </span>
                      ))}
                      <input
                        type="text"
                        className="border-0 bg-transparent flex-grow-1 px-1"
                        style={{outline: 'none', minWidth: '120px', fontSize: '0.9rem'}}
                        placeholder="Type a skill..."
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                      />
                    </div>

                    {skillInput && (
                      <div className="d-flex flex-wrap gap-2">
                        {filteredAvailableSkills.length > 0 ? (
                          filteredAvailableSkills.slice(0, 5).map((skill) => (
                            <span key={skill.id} className="badge-subtle px-3 py-2 fw-normal" style={{cursor: 'pointer'}} onClick={() => handleAddSkill(skill)}>
                              + {skill.name}
                            </span>
                          ))
                        ) : (
                          <span className="small text-muted">No matches found.</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Submit */}
                  <div className="mt-auto pt-4">
                    <button type="submit" className="btn btn-brand w-100 py-3 fw-bold">
                      Save Profile & Choose Resources ➔
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </form>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfileSetupPage;