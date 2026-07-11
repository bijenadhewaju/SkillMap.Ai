import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import logoStr from '../assets/logo_str.svg';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  // Pull user state and logout function directly from Context
  const { user, logoutUser } = useContext(AuthContext);

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

            {/* Render based on actual global AuthContext state */}
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link px-3 text-dark" to="/profile-setup">Profile</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link px-3 text-dark" to="/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item ms-lg-3">
                  <button onClick={logoutUser} className="btn btn-outline-danger px-4">
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