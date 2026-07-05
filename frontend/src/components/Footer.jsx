import React from 'react';
import logo from '../assets/logo.svg';

const Footer = () => {
  return (
    <footer className="bg-white text-dark py-5 mt-auto border-top">
      <div className="container text-center">
        <img src={logo} alt="SkillMap AI Logo" height="100" className="mb-3" />
        <p className="mb-1 fw-medium">&copy; {new Date().getFullYear()} SkillMap AI.</p>
        <small className="text-secondary">Intelligent skill gap analysis and career recommendations.</small>
      </div>
    </footer>
  );
};

export default Footer;