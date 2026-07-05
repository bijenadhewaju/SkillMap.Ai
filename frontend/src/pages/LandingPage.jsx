import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      {/* HOME / HERO SECTION */}
      <header id="home" className="pt-5 pb-5 mt-5">
        <div className="container text-center py-5 mt-4">
          <h1 className="display-5 fw-bold text-brand mb-3">Map Your Future in Tech</h1>
          <p className="lead mx-auto mb-5 text-secondary" style={{ maxWidth: '650px' }}>
            Don't guess what skills you need. Let our AI analyze your profile, identify your missing competencies, and generate a clear, actionable learning roadmap.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/login" className="btn btn-brand btn-lg px-5">Get Started Free</Link>
            <a href="#workflow" className="btn btn-outline-brand btn-lg px-5">How It Works</a>
          </div>
        </div>
      </header>

      {/* FEATURES SECTION - Removed emojis, added subtle borders */}
      <section id="features" className="py-5 bg-soft border-top border-bottom">
        <div className="container py-4">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-dark">Intelligent Platform Features</h2>
            <p className="text-secondary">Everything you need to accelerate your career transition.</p>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border p-4 bg-white shadow-sm rounded-0">
                <div className="card-body text-center">
                  <h5 className="fw-bold text-brand mb-3">AI Career Prediction</h5>
                  <p className="text-secondary small mb-0">We analyze your current skills to predict the most suitable tech careers for you based on real industry demands.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border p-4 bg-white shadow-sm rounded-0">
                <div className="card-body text-center">
                  <h5 className="fw-bold text-brand mb-3">Skill Gap Analysis</h5>
                  <p className="text-secondary small mb-0">Compare your profile against your dream job to instantly identify the exact technical skills you are missing.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border p-4 bg-white shadow-sm rounded-0">
                <div className="card-body text-center">
                  <h5 className="fw-bold text-brand mb-3">Personalized Roadmaps</h5>
                  <p className="text-secondary small mb-0">Generate a structured, step-by-step learning path complete with recommended courses and hands-on projects.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WORKFLOW SECTION */}
      <section id="workflow" className="py-5">
        <div className="container py-4">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-dark">How It Works</h2>
            <p className="text-secondary">Your journey from beginner to hired in four simple steps.</p>
          </div>
          <div className="row text-center">
            <div className="col-md-3 mb-4">
              <h3 className="text-brand fw-bold mb-3">01.</h3>
              <h6 className="fw-bold">Create Profile</h6>
              <p className="text-secondary small mt-2">Enter your education and technical skills.</p>
            </div>
            <div className="col-md-3 mb-4">
              <h3 className="text-brand fw-bold mb-3">02.</h3>
              <h6 className="fw-bold">Select Career</h6>
              <p className="text-secondary small mt-2">Choose your target role in the industry.</p>
            </div>
            <div className="col-md-3 mb-4">
              <h3 className="text-brand fw-bold mb-3">03.</h3>
              <h6 className="fw-bold">AI Analysis</h6>
              <p className="text-secondary small mt-2">Identify your skill gaps instantly.</p>
            </div>
            <div className="col-md-3 mb-4">
              <h3 className="text-brand fw-bold mb-3">04.</h3>
              <h6 className="fw-bold">Start Learning</h6>
              <p className="text-secondary small mt-2">Follow your personalized roadmap.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;