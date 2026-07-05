import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ProfileSetupPage = () => {
  const navigate = useNavigate();

  // 1. Dynamic Education State
  const [educations, setEducations] = useState([
    { id: Date.now(), degree_level: '', stream: '', status: 'Completed', timeline: '' }
  ]);

  // 2. Experience State
  const [experience, setExperience] = useState({ years: 0, previousRole: '' });

  // 3. Target Career State
  const [targetCareer, setTargetCareer] = useState('');
  const careerOptions = ["Full Stack Developer", "Data Scientist", "Machine Learning Engineer", "DevOps Engineer", "Frontend Developer", "Backend Developer"];

  // 4. Skills State (Bubbles)
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const suggestedSkills = ["Python", "React", "PostgreSQL", "Docker", "JavaScript", "Django"];

  // --- Handlers ---
  const handleAddEducation = () => {
    setEducations([...educations, { id: Date.now(), degree_level: '', stream: '', status: 'Completed', timeline: '' }]);
  };

  const handleRemoveEducation = (id) => {
    setEducations(educations.filter(edu => edu.id !== id));
  };

  const handleEducationChange = (id, field, value) => {
    setEducations(educations.map(edu => edu.id === id ? { ...edu, [field]: value } : edu));
  };

  const handleAddSkill = (skillToAdd) => {
    const trimmed = skillToAdd.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
    }
    setSkillInput('');
  };

  const handleKeyDownSkill = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill(skillInput);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = { educations, experience, targetCareer, skills };
    console.log('Saving profile data:', finalData);
    // TODO: Send this to the Django API later
    navigate('/roadmap');
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-soft">
      <Navbar />
      <main className="flex-grow-1 pt-5 mt-5 pb-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">

              <div className="card border-0 shadow-sm rounded-3 p-4 bg-white">
                <div className="card-body">
                  <h3 className="fw-bold text-brand mb-2">Build Your Career Profile</h3>
                  <p className="text-secondary mb-4 small">Help us map your background to your future career.</p>

                  <form onSubmit={handleSubmit}>

                    {/* SECTION 1: EDUCATION */}
                    <div className="mb-5 p-4 border rounded-3 bg-light bg-opacity-50">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="fw-bold mb-0 text-dark">Education History</h6>
                        <button type="button" className="btn btn-sm btn-outline-brand" onClick={handleAddEducation}>
                          + Add Degree
                        </button>
                      </div>

                      {educations.map((edu, index) => (
                        <div key={edu.id} className="row g-3 mb-3 pb-3 border-bottom position-relative">
                          {educations.length > 1 && (
                            <button type="button" className="btn-close position-absolute top-0 end-0 mt-1 me-1" style={{fontSize: '0.6rem'}} onClick={() => handleRemoveEducation(edu.id)}></button>
                          )}
                          <div className="col-md-6">
                            <label className="form-label small text-secondary fw-medium">Degree Level</label>
                            <input type="text" className="form-control" placeholder="e.g. B.Tech, Masters, Bootcamp" value={edu.degree_level} onChange={(e) => handleEducationChange(edu.id, 'degree_level', e.target.value)} required />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label small text-secondary fw-medium">Course / Stream</label>
                            <input type="text" className="form-control" placeholder="e.g. Computer Science" value={edu.stream} onChange={(e) => handleEducationChange(edu.id, 'stream', e.target.value)} required />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label small text-secondary fw-medium">Status</label>
                            <select className="form-select" value={edu.status} onChange={(e) => handleEducationChange(edu.id, 'status', e.target.value)}>
                              <option value="Completed">Completed</option>
                              <option value="Ongoing">Ongoing</option>
                            </select>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label small text-secondary fw-medium">{edu.status === 'Completed' ? 'Graduation Year' : 'Current Semester/Year'}</label>
                            <input type="text" className="form-control" placeholder="e.g. 2023 or 6th Sem" value={edu.timeline} onChange={(e) => handleEducationChange(edu.id, 'timeline', e.target.value)} required />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* SECTION 2: EXPERIENCE */}
                    <div className="mb-5 p-4 border rounded-3 bg-light bg-opacity-50">
                      <h6 className="fw-bold mb-3 text-dark">Work Experience</h6>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label small text-secondary fw-medium">Years of Experience</label>
                          <select className="form-select" value={experience.years} onChange={(e) => setExperience({...experience, years: parseInt(e.target.value)})}>
                            <option value={0}>0 Years (Fresher)</option>
                            <option value={1}>1 Year</option>
                            <option value={2}>2 Years</option>
                            <option value={3}>3+ Years</option>
                          </select>
                        </div>
                        {/* CONDITIONAL FIELD */}
                        {experience.years > 0 && (
                          <div className="col-md-6">
                            <label className="form-label small text-secondary fw-medium">Previous / Current Role</label>
                            <input type="text" className="form-control" placeholder="e.g. QA Tester, Support Engineer" value={experience.previousRole} onChange={(e) => setExperience({...experience, previousRole: e.target.value})} required />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* SECTION 3: TARGET CAREER */}
                    <div className="mb-5">
                      <label className="form-label fw-bold text-dark">Target Tech Career</label>
                      <input
                        type="text"
                        className="form-control"
                        list="careerOptions"
                        placeholder="Search or type a career..."
                        value={targetCareer}
                        onChange={(e) => setTargetCareer(e.target.value)}
                        required
                      />
                      <datalist id="careerOptions">
                        {careerOptions.map((career, i) => <option key={i} value={career} />)}
                      </datalist>
                    </div>

                    {/* SECTION 4: SKILLS (CHIPS) */}
                    <div className="mb-5">
                      <label className="form-label fw-bold text-dark">Current Technical Skills</label>

                      {/* Interactive Skill Input Box */}
                      <div className="border rounded-3 p-2 d-flex flex-wrap gap-2 mb-3 bg-" style={{minHeight: '50px'}}>
                        {skills.map((skill, index) => (
                          <span key={index} className="badge bg-body-secondary text-dark rounded-pill px-3 py-2 d-flex align-items-center fw-normal fs-6">
                            {skill}
                            <button type="button" className="btn-close btn-close-white ms-2" style={{fontSize: '0.5rem'}} onClick={() => handleRemoveSkill(skill)}></button>
                          </span>
                        ))}
                        <input
                          type="text"
                          className="border-0 flex-grow-1 p-1"
                          style={{outline: 'none', minWidth: '150px'}}
                          placeholder="Type a skill and press Enter..."
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyDown={handleKeyDownSkill}
                        />
                      </div>

                      {/* Clickable Suggestions */}
                      <div className="d-flex flex-wrap gap-2">
                        <span className="small text-muted mt-1 me-2">Suggestions:</span>
                        {suggestedSkills.filter(s => !skills.includes(s)).map((skill, i) => (
                          <span
                            key={i}
                            className="badge bg-light text-secondary border rounded-pill px-3 py-2 cursor-pointer transition-all hover-brand"
                            style={{cursor: 'pointer'}}
                            onClick={() => handleAddSkill(skill)}
                          >
                            + {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button type="submit" className="btn btn-brand w-100 py-3 fw-medium fs-5">
                      Generate Learning Roadmap
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