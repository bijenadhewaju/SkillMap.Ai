import React from 'react';
import { Link } from 'react-router-dom';
import logoStr from '../assets/logo_str.svg';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top shadow-sm">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={logoStr} alt="SkillMap AI" height="50" />
          <p className="mt-4 fw-bolder text-brand">skillmap.ai</p>
        </Link>
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto fw-medium">
            <li className="nav-item"><a className="nav-link px-3 text-dark" href="/#home">Home</a></li>
            <li className="nav-item"><a className="nav-link px-3 text-dark" href="/#features">Features</a></li>
            <li className="nav-item"><a className="nav-link px-3 text-dark" href="/#workflow">How It Works</a></li>
            <li className="nav-item"><a className="nav-link px-3 text-dark" href="/#about">About</a></li>
            <li className="nav-item ms-lg-3">
              <Link className="btn btn-brand px-4" to="/login">Login</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;