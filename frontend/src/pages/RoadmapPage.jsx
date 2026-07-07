import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const RoadmapPage = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(true);
  const [selections, setSelections] = useState({});

  const roadmapSteps = [
    {
      id: 'step1',
      title: 'Step 1: Backend Architecture (Django)',
      objective: 'Core objective: Learn routing, controller mapping, and REST API serialization frameworks.',
      options: [
        {
          id: 'opt1_1',
          title: 'Django for Professionals',
          platform: 'Platform: Coursera (Structured, Video Modules)',
          description: 'Comprehensive structural approach with milestone grading metrics.'
        },
        {
          id: 'opt1_2',
          title: 'Building Production APIs',
          platform: 'Platform: YouTube (Free, Hands-on Project)',
          description: 'Practical deployment-centric builds using standalone open source tutorials.'
        }
      ]
    },
    {
      id: 'step2',
      title: 'Step 2: Relational Databases (PostgreSQL)',
      objective: 'Core objective: Write performant query lookups, handle join normalization, and manage migrations.',
      options: [
        {
          id: 'opt2_1',
          title: 'Official Documentation Roadmap',
          platform: 'Platform: Textbook/Docs (Text-heavy, Deep dive)',
          description: 'Highly granular theoretical approach covering configurations and constraints.'
        },
        {
          id: 'opt2_2',
          title: 'The Complete SQL Bootcamp',
          platform: 'Platform: Udemy (Practical Exercises)',
          description: 'Interactive workspace terminal lessons focusing on operational commands.'
        }
      ]
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSelect = (stepId, optionId) => {
    setSelections(prev => ({
      ...prev,
      [stepId]: optionId
    }));
  };

  const handleSaveRoadmap = async () => {
    console.log("Saving choices to Dashboard:", selections);
    navigate('/dashboard');
  };

  if (isGenerating) {
    return (
      <div className="d-flex flex-column min-vh-100 bg-soft">
        <Navbar />
        <main className="flex-grow-1 d-flex flex-column align-items-center justify-content-center">
          <div className="spinner-border text-brand mb-4" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4 className="fw-bold text-dark">AI is mapping your path...</h4>
          <p className="text-secondary">Analyzing skill gaps and finding the best resources.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100 bg-white">
      <Navbar />
      <main className="flex-grow-1 pt-5 mt-5 pb-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">

              <div className="text-center mb-5">
                <h1 className="fw-bold text-dark mb-3">Customize Your Learning Path</h1>
                <p className="text-secondary fs-6 px-4">
                  We discovered gaps in your technical background. Select the learning track option you prefer for each skill before saving your active roadmap.
                </p>
              </div>

              {roadmapSteps.map((step) => (
                <div key={step.id} className="card border rounded-3 mb-4 shadow-sm bg-white">
                  <div className="card-body p-4 p-md-5">
                    <h4 className="fw-bold text-brand">{step.title}</h4>
                    <p className="text-secondary mb-4">{step.objective}</p>

                    <div className="row g-4">
                      {step.options.map((option) => {
                        const isSelected = selections[step.id] === option.id;
                        return (
                          <div key={option.id} className="col-md-6">
                            <div
                              className={`card h-100 rounded-3 transition-all`}
                              onClick={() => handleSelect(step.id, option.id)}
                              style={{
                                cursor: 'pointer',
                                border: isSelected ? '1px solid var(--brand-primary)' : '1px solid #dee2e6',
                                backgroundColor: isSelected ? 'rgba(39, 78, 146, 0.05)' : '#ffffff'
                              }}
                            >
                              <div className="card-body p-4">
                                <h6 className={`fw-bold mb-1 ${isSelected ? 'text-brand' : 'text-dark'}`}>
                                  {option.title}
                                </h6>
                                <p className="small text-secondary mb-3">{option.platform}</p>
                                <p className="small text-muted mb-0" style={{ lineHeight: '1.6' }}>
                                  {option.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}

              <div className="mt-5 text-center">
                <button
                  onClick={handleSaveRoadmap}
                  className="btn btn-brand px-5 py-3 fw-medium rounded-3"
                >
                  Save Active Roadmap
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