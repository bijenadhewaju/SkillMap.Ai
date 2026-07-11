import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api';

const ProfileSetupPage = () => {
  const navigate = useNavigate();

  // --- New API State ---
  const [availableCareers, setAvailableCareers] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);

  // Education State
  const [educations, setEducations] = useState([
    { id: Date.now(), degree_level: '', stream: '', status: 'Completed', timeline: '' }
  ]);

  // Experience State
  const [experience, setExperience] = useState({ years: 0, previousRole: '' });

  // Target Career State (Stores the selected Career ID)
  const [targetCareer, setTargetCareer] = useState('');

  // Skills State (Stores selected Skill Objects)
  const [skills, setSkills] = useState([]);
  // Input for searching/adding skills from the dropdown
  const [skillInput, setSkillInput] = useState('');

  // --- Fetch Data on Load (Correctly placed at the top level) ---
  useEffect(() => {
    const fetchDropdownData = async () => {
        try {
            const [careersResponse, skillsResponse] = await Promise.all([
                api.get('/api/careers/'),
                api.get('/api/skills/')
            ]);
            setAvailableCareers(careersResponse.data);
            setAvailableSkills(skillsResponse.data);
        } catch (error) {
            console.error("Failed to fetch skills or careers", error);
        }
    };
    fetchDropdownData();
  }, []);

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

  // Modified to handle skill objects from API
  const handleAddSkill = (skillObj) => {
    // Check if the skill is already selected based on its ID
    if (!skills.find(s => s.id === skillObj.id)) {
      setSkills([...skills, skillObj]);
    }
    setSkillInput(''); // Clear input after adding
  };

  // Filter skills based on user typing
  const filteredAvailableSkills = availableSkills.filter(skill =>
    skill.name.toLowerCase().includes(skillInput.toLowerCase()) &&
    !skills.find(s => s.id === skill.id) // Don't suggest already selected skills
  );

  const handleRemoveSkill = (skillIdToRemove) => {
    setSkills(skills.filter(skill => skill.id !== skillIdToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data payload with IDs
    const finalData = {
      experience_years: experience.years,
      previous_role: experience.previousRole,
      target_career: parseInt(targetCareer), // Ensure it's a number (ID)
      educations: educations,
      // Create array of just the skill IDs
      skills: skills.map(skill => skill.id)
    };

    try {
      await api.patch('/api/accounts/profile/', finalData);
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
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">

              <div className="card border-0 shadow-sm rounded-3 p-4 bg-white">
                <div className="card-body">
                  <h3 className="fw-bold text-brand mb-2">Build Your Career Profile</h3>
                  <p className="text-secondary mb-4 small">Help us map your background to your future career.</p>

                  <form onSubmit={handleSubmit}>

                    {/* SECTION 1: EDUCATION */}
                    {/* ... (Education section remains exactly the same) ... */}
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
                            <input type="text" className="form-control" placeholder="e.g. Computer Science, Nursing" value={edu.stream} onChange={(e) => handleEducationChange(edu.id, 'stream', e.target.value)} required />
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
                    {/* ... (Experience section remains exactly the same) ... */}
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
                        {experience.years > 0 && (
                          <div className="col-md-6">
                            <label className="form-label small text-secondary fw-medium">Previous / Current Role</label>
                            <input type="text" className="form-control" placeholder="e.g. Sales Associate, Intern" value={experience.previousRole} onChange={(e) => setExperience({...experience, previousRole: e.target.value})} required />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* SECTION 3: TARGET CAREER (Updated for API data) */}
                    <div className="mb-5">
                      <label className="form-label fw-bold text-dark">Target Career</label>
                      <select
                        className="form-select"
                        value={targetCareer}
                        onChange={(e) => setTargetCareer(e.target.value)}
                        required
                      >
                        <option value="" disabled>Select a career...</option>
                        {availableCareers.map((career) => (
                          <option key={career.id} value={career.id}>
                            {career.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* SECTION 4: SKILLS  */}
                    <div className="mb-5">
                      <label className="form-label fw-bold text-dark">Current Skills</label>

                      <div className="border rounded-3 p-2 d-flex flex-wrap gap-2 mb-3 bg-" style={{minHeight: '50px'}}>
                        {/* Display Selected Skills */}
                        {skills.map((skill) => (
                          <span key={skill.id} className="badge bg-body-secondary text-dark rounded-pill px-3 py-2 d-flex align-items-center fw-normal fs-6">
                            {skill.name}
                            <button type="button" className="btn-close btn-close-white ms-2" style={{fontSize: '0.5rem'}} onClick={() => handleRemoveSkill(skill.id)}></button>
                          </span>
                        ))}

                        <input
                          type="text"
                          className="border-0 flex-grow-1 p-1"
                          style={{outline: 'none', minWidth: '150px'}}
                          placeholder="Search and add a skill..."
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                        />
                      </div>

                      {/* Display Suggestions based on Search */}
                      {skillInput && filteredAvailableSkills.length > 0 && (
                          <div className="d-flex flex-wrap gap-2 mt-2">
                             <span className="small text-muted mt-1 me-2">Suggestions:</span>
                             {filteredAvailableSkills.slice(0, 5).map((skill) => (
                               <span
                                 key={skill.id}
                                 className="badge bg-light text-secondary border rounded-pill px-3 py-2 cursor-pointer transition-all hover-brand"
                                 style={{cursor: 'pointer'}}
                                 onClick={() => handleAddSkill(skill)}
                               >
                                 + {skill.name}
                               </span>
                             ))}
                          </div>
                      )}
                       {skillInput && filteredAvailableSkills.length === 0 && (
                          <div className="small text-muted mt-2">No matching skills found.</div>
                      )}
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