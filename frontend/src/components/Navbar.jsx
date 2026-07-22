import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logoStr from '../assets/logo_str.svg';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top shadow-sm py-2">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={logoStr} alt="SkillMap AI" height="40" />
          <span className="ms-2 fw-bold text-brand fs-5">skillmap.ai</span>
        </Link>
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <button className="nav-link btn btn-link px-3 text-dark text-decoration-none fw-medium" onClick={() => handleNavClick('home')}>Home</button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link px-3 text-dark text-decoration-none fw-medium" onClick={() => handleNavClick('features')}>Features</button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link px-3 text-dark text-decoration-none fw-medium" onClick={() => handleNavClick('workflow')}>How It Works</button>
            </li>

            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link px-3 text-dark fw-medium" to="/profile-setup">Profile</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link px-3 text-dark fw-medium" to="/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item ms-lg-3">
                  <button onClick={logoutUser} className="btn btn-outline-brand px-4 py-2">
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