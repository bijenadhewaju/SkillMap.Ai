import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api';
import { AuthContext } from '../context/AuthContext';

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [roadmapData, setRoadmapData] = useState(null);
  const [allDbSkills, setAllDbSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingSync, setIsUpdatingSync] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [profileRes, careersRes, skillsRes] = await Promise.all([
          api.get('/api/accounts/profile/'),
          api.get('/api/careers/'),
          api.get('/api/skills/')
        ]);

        const profile = profileRes.data;
        const careers = careersRes.data;
        const skills = skillsRes.data;

        setAllDbSkills(skills);

        const mappedCareer = careers.find(c => String(c.id) === String(profile.target_career));
        const targetCareerTitle = mappedCareer ? mappedCareer.title : "Software Developer";
        profile.target_career_title = targetCareerTitle;

        let userSkillNames = [];
        if (Array.isArray(profile.skills)) {
          userSkillNames = profile.skills.map(skillItem => {
            if (typeof skillItem === 'object' && skillItem !== null) return skillItem.name;
            const matched = skills.find(s => String(s.id) === String(skillItem));
            return matched ? matched.name : '';
          }).filter(Boolean);
        }
        profile.skill_names = userSkillNames;
        setProfileData(profile);

        const cachedRoadmap = localStorage.getItem('userRoadmap');

        if (cachedRoadmap) {
          setRoadmapData(JSON.parse(cachedRoadmap));
        } else {
          const roadmapRes = await api.post('/api/generate-roadmap/', {
            target_role: targetCareerTitle,
            experience_level: "Fresher",
            user_skills: userSkillNames
          });
          setRoadmapData(roadmapRes.data);
          localStorage.setItem('userRoadmap', JSON.stringify(roadmapRes.data));
        }

      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleCompleteSkill = async (skillNameToComplete) => {
    if (isUpdatingSync) return;
    setIsUpdatingSync(true);

    try {
      const skillObj = allDbSkills.find(s => s.name === skillNameToComplete);
      if (!skillObj) {
        console.error("Skill not found in database list");
        setIsUpdatingSync(false);
        return;
      }

      const currentSkillIds = (profileData.skill_names || []).map(name => {
        const found = allDbSkills.find(s => s.name === name);
        return found ? found.id : null;
      }).filter(Boolean);

      const newSkillIds = [...currentSkillIds, skillObj.id];

      await api.patch('/api/accounts/profile/', {
        skills: newSkillIds
      });

      const updatedMissing = roadmapData.missing_skills.filter(s => s !== skillNameToComplete);
      const updatedCurrent = [...(profileData.skill_names || []), skillNameToComplete];
      const newMatch = Math.min(100, (roadmapData.match_percentage || 0) + 15);

      setRoadmapData({...roadmapData, missing_skills: updatedMissing, match_percentage: newMatch});
      setProfileData({...profileData, skill_names: updatedCurrent});

      const updatedRoadmap = {...roadmapData, missing_skills: updatedMissing, match_percentage: newMatch};
      localStorage.setItem('userRoadmap', JSON.stringify(updatedRoadmap));

    } catch (error) {
      console.error("Error saving skill to database", error);
      alert("Failed to save skill. Please try again.");
    } finally {
      setIsUpdatingSync(false);
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex flex-column min-vh-100 bg-soft align-items-center justify-content-center">
        <Navbar />
        <div className="spinner-border text-brand" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const displayData = {
    name: user?.username || "Explorer",
    title: profileData?.target_career_title || "Aspiring Professional",
    education: profileData?.educations?.length > 0
      ? profileData.educations.map(e => e.stream).join(', ')
      : "No education added",
    experience: "Fresher",
  };

  const currentSkills = profileData?.skill_names?.length > 0 ? profileData.skill_names : ["No skills added yet"];
  const missingSkills = roadmapData?.missing_skills || [];
  const studyModules = roadmapData?.study_plan?.roadmap || [];

  return (
    <div className="d-flex flex-column min-vh-100 bg-soft">
      <Navbar />

      <main className="flex-grow-1 pt-5 mt-5 pb-5">
        <div className="container py-4">
          <div className="row mb-5">
            <div className="col-12">
              <h2 className="fw-bold text-brand fs-1">Welcome back, {displayData.name}!</h2>
              <p className="text-secondary fs-5">Here is your personalized skill map and live career analysis.</p>
            </div>
          </div>

          <div className="row g-4">
            {/* Sidebar info */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm mb-4 bg-white p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-brand text-white d-flex align-items-center justify-content-center fw-bold fs-3" style={{width: '60px', height: '60px'}}>
                    {displayData.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="ms-3">
                    <h5 className="fw-bold mb-0 text-capitalize text-dark">{displayData.name}</h5>
                    <span className="badge bg-soft text-dark border-0 mt-1 fw-normal">{displayData.experience}</span>
                  </div>
                </div>
                <hr className="text-muted" />
                <p className="small text-secondary mb-1"><strong>Education:</strong> {displayData.education}</p>
                <p className="small text-secondary mb-0"><strong>Target:</strong> {displayData.title}</p>
                <button className="btn btn-outline-brand btn-sm w-100 mt-3" onClick={() => navigate('/profile-setup')}>Edit Profile</button>
              </div>

              <div className="card border-0 shadow-sm bg-white p-4">
                <h6 className="fw-bold text-brand mb-3">My Earned Skills</h6>
                <div className="d-flex flex-wrap gap-2">
                  {currentSkills.map((skill, index) => (
                    <span key={index} className="skill-badge px-3 py-2 fw-normal">
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="col-lg-8">

              {/* Gamified Checklist UI */}
              <div className="card border-0 shadow-sm mb-4 bg-white p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold text-brand mb-0">Missing Competencies</h5>
                  <span className="badge bg-brand text-white px-3 py-2 fw-medium">Target Match: {roadmapData?.match_percentage || 0}%</span>
                </div>

                {missingSkills.length > 0 ? (
                  <div>
                    {missingSkills.map((skill, index) => (
                      <button
                        key={index}
                        onClick={() => handleCompleteSkill(skill)}
                        disabled={isUpdatingSync}
                        className="w-100 text-start border-0 bg-transparent p-0 mb-3"
                      >
                        <div className="d-flex justify-content-between align-items-center p-3 bg-soft border-0" style={{ cursor: isUpdatingSync ? 'wait' : 'pointer' }}>
                          <div className="d-flex align-items-center">
                            <div className="bg-white border d-flex justify-content-center align-items-center me-3" style={{width: '24px', height: '24px'}}>
                              <span style={{opacity: 0.1}}>✓</span>
                            </div>
                            <span className="fw-medium text-dark">{skill}</span>
                          </div>
                          <span className="badge-subtle px-3 py-2 fw-medium">Mark as Learned +</span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-5 text-center bg-soft border border-brand mt-3">
                    <h4 className="fw-bold text-brand mb-2">100% Skill Match!</h4>
                    <p className="text-secondary mb-0">You have successfully gained all the skills required for {displayData.title}. You are ready to apply for roles.</p>
                  </div>
                )}
              </div>

              {/* Roadmap UI */}
              <div className="card border-0 shadow-sm bg-white p-4">
                <h5 className="fw-bold text-brand mb-4">Your Action Plan</h5>
                <div>
                  {studyModules.length > 0 ? studyModules.map((module, index) => (
                    <div key={index} className="mb-3 p-4 bg-soft border-start border-brand">
                      <h6 className="fw-bold text-brand mb-2">Phase {index + 1}: {module.focus}</h6>
                      <p className="small text-secondary mb-3">{module.objective}</p>
                      <div className="d-flex flex-wrap gap-2">
                        {module.action_items?.map((action, aIdx) => (
                          <span key={aIdx} className="badge bg-white text-dark border px-3 py-2 small fw-normal">
                            {action}
                          </span>
                        ))}
                      </div>
                    </div>
                  )) : <p className="text-secondary small">No plan generated yet.</p>}
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