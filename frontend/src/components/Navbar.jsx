import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoStr from '../assets/logo_str.svg';

const Navbar = () => {
  const navigate = useNavigate();

  // Basic check: if a token exists, we assume the user is logged in.
  const isAuthenticated = !!localStorage.getItem('access_token');

  const handleLogout = () => {
    // 1. Remove the tokens from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    // 2. Redirect the user back to the login page
    navigate('/login');
  };

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
          <ul className="navbar-nav ms-auto fw-medium align-items-center">
            <li className="nav-item"><a className="nav-link px-3 text-dark" href="/#home">Home</a></li>
            <li className="nav-item"><a className="nav-link px-3 text-dark" href="/#features">Features</a></li>
            <li className="nav-item"><a className="nav-link px-3 text-dark" href="/#workflow">How It Works</a></li>
            <li className="nav-item"><a className="nav-link px-3 text-dark" href="/#about">About</a></li>

            {/* Conditional Rendering based on Authentication state */}
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link className="nav-link px-3 text-dark" to="/profile-setup">Profile</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link px-3 text-dark" to="/dashboard">Dashboard</Link>
              </li>
              <li className="nav-item ms-lg-3">
                <button onClick={handleLogout} className="btn btn-outline-danger px-4">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item ms-lg-3">
                <Link className="btn btn-outline-brand px-4 me-2" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-brand px-4" to="/register">Sign Up</Link>
              </li>
            </>
          )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;