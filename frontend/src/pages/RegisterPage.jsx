import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api';
import AuthContext from '../context/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      // 1. Create the account in Django
      await api.post('/api/accounts/register/', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      // 2. Automatically log the user in
      await loginUser(formData.username, formData.password);

      // 3. Send them to setup their profile
      navigate('/profile-setup');
    } catch (err) {
      setError('Failed to register. Username or email might already be taken.');
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-soft">
      <Navbar />

      <main className="flex-grow-1 d-flex align-items-center justify-content-center pt-5 mt-5 pb-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">

              <div className="card border-0 shadow-sm rounded-3 p-4 bg-white">
                <div className="card-body">
                  <h3 className="fw-bold text-center text-brand mb-1">Create an Account</h3>
                  <p className="text-center text-secondary mb-4 small">Start mapping your tech career today.</p>

                  {error && <div className="alert alert-danger py-2 small">{error}</div>}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label fw-medium text-dark small">Username</label>
                      <input
                        type="text"
                        className="form-control"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="johndoe123"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-medium text-dark small">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="name@example.com"
                        required
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-medium text-dark small">Password</label>
                        <input
                          type="password"
                          className="form-control"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="••••••••"
                          required
                          minLength="8"
                        />
                      </div>
                      <div className="col-md-6 mb-4">
                        <label className="form-label fw-medium text-dark small">Confirm Password</label>
                        <input
                          type="password"
                          className="form-control"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    </div>

                    <button type="submit" className="btn btn-brand w-100 mb-3 py-2">
                      Sign Up
                    </button>
                  </form>

                  <div className="text-center mt-3">
                    <p className="text-secondary small mb-0">
                      Already have an account? <Link to="/login" className="text-brand text-decoration-none fw-medium">Log in</Link>
                    </p>
                  </div>
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

export default RegisterPage;