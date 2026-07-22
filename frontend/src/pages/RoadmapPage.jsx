import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api';

const RoadmapPage = () => {
  const navigate = useNavigate();

  const [isGenerating, setIsGenerating] = useState(true);
  const [roadmapData, setRoadmapData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [selections, setSelections] = useState({});
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfileAndGenerate = async () => {
      try {
        const [profileRes, careersRes, skillsRes] = await Promise.all([
          api.get('/api/accounts/profile/'),
          api.get('/api/careers/'),
          api.get('/api/skills/')
        ]);

        const profile = profileRes.data;
        const careers = careersRes.data;
        const skills = skillsRes.data;
        setProfileData(profile);

        const mappedCareer = careers.find(c => String(c.id) === String(profile.target_career));
        const targetCareerTitle = mappedCareer ? mappedCareer.title : "Software Developer";

        let userSkillNames = [];
        if (Array.isArray(profile.skills)) {
          userSkillNames = profile.skills.map(skillItem => {
            if (typeof skillItem === 'object' && skillItem !== null) return skillItem.name;
            const matched = skills.find(s => String(s.id) === String(skillItem));
            return matched ? matched.name : '';
          }).filter(Boolean);
        }

        const roadmapRes = await api.post('/api/generate-roadmap/', {
          target_role: targetCareerTitle,
          experience_level: profile.experience_years > 0 ? "Mid-Level" : "Fresher",
          user_skills: userSkillNames
        });

        setRoadmapData(roadmapRes.data);

      } catch (err) {
        console.error(err);
        setError("Failed to analyze profile. Please ensure your backend is running.");
      } finally {
        setIsGenerating(false);
      }
    };

    fetchProfileAndGenerate();
  }, []);

  const handleSelect = (skillName, resourceTitle) => {
    setSelections(prev => ({
      ...prev,
      [skillName]: resourceTitle
    }));
  };

  const handleSaveRoadmap = async () => {
    if (!profileData || !profileData.target_career) {
      alert("Missing career target. Please update your profile.");
      return;
    }

    setIsSaving(true);

    try {
      const formattedSteps = roadmapData.study_plan.roadmap.map((module, index) => ({
        title: module.focus,
        description: `Goal: ${module.objective}\nActions: ${module.action_items.join(', ')}\nSelected Resource: ${selections[module.focus] || 'None selected'}`,
        order_no: index + 1,
        status: 'Pending'
      }));

      const payload = {
        career: profileData.target_career,
        steps: formattedSteps
      };

      await api.post('/api/roadmaps/', payload);
      localStorage.removeItem('userRoadmap');
      navigate('/dashboard');

    } catch (error) {
      console.error("Failed to save roadmap to database", error);
      alert("Failed to save roadmap. Please check your connection.");
      setIsSaving(false);
    }
  };

  if (isGenerating) {
    return (
      <div className="d-flex flex-column min-vh-100 bg-soft">
        <Navbar />
        <main className="flex-grow-1 d-flex flex-column align-items-center justify-content-center">
          <div className="spinner-border text-brand mb-4" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4 className="fw-bold text-brand">SkillMap AI is analyzing your profile...</h4>
          <p className="text-secondary">Comparing your skills against industry requirements.</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex flex-column min-vh-100 bg-soft">
        <Navbar />
        <main className="flex-grow-1 d-flex align-items-center justify-content-center">
          <div className="text-center text-brand">
            <h4>Error generating roadmap</h4>
            <p>{error}</p>
            <button className="btn btn-outline-brand mt-3" onClick={() => navigate('/profile-setup')}>Back to Profile Setup</button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100 bg-soft">
      <Navbar />
      <main className="flex-grow-1 pt-5 mt-5 pb-5">
        <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-lg-10">

              <div className="text-center mb-5">
                <h1 className="fw-bold text-brand mb-3">Your Personalized SkillMap</h1>
                <p className="text-secondary fs-6 px-4 mb-4">
                  Target Role: <span className="text-brand fw-bold">{roadmapData?.target_role}</span> | Match: <span className="text-brand fw-bold">{roadmapData?.match_percentage}%</span>
                </p>
                <div className="alert alert-info d-inline-block">
                  <strong>Skill Gaps Detected:</strong> {roadmapData?.missing_skills?.join(', ') || 'None!'}
                </div>
              </div>

              {roadmapData?.study_plan?.roadmap?.map((module, index) => (
                <div key={index} className="card border-0 shadow-sm mb-4 bg-white p-4">
                  <h4 className="fw-bold text-brand">Skill Focus: {module.focus}</h4>
                  <p className="text-secondary mb-4">Action Plan: {module.action_items?.join(', ')}</p>

                  <div className="row g-4">
                    {module.resources?.map((resource, resIdx) => {
                      const resourceTitle = typeof resource === 'string' ? resource : resource.title;
                      const isSelected = selections[module.focus] === resourceTitle;
                      return (
                        <div key={resIdx} className="col-md-6">
                          <div
                            className="card h-100 border-0 shadow-sm"
                            onClick={() => handleSelect(module.focus, resourceTitle)}
                            style={{
                              cursor: 'pointer',
                              borderLeft: isSelected ? '3px solid #152d52' : '3px solid transparent',
                              backgroundColor: isSelected ? 'rgba(21, 45, 82, 0.04)' : '#ffffff'
                            }}
                          >
                            <div className="card-body p-4">
                              <h6 className={`fw-bold mb-1 ${isSelected ? 'text-brand' : 'text-dark'}`}>
                                {resourceTitle}
                              </h6>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="mt-5 text-center">
                <button
                  onClick={handleSaveRoadmap}
                  className="btn btn-brand px-5 py-3 fw-medium"
                  disabled={Object.keys(selections).length === 0 || isSaving}
                >
                  {isSaving ? "Saving to Database..." : "Save Active Roadmap"}
                </button>
              </div>

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RoadmapPage;