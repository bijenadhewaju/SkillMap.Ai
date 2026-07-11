import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '', // Using username for Django JWT auth
    password: ''
  });

  const [error, setError] = useState(null);
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Call the global login function
    const result = await loginUser(formData.email, formData.password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-soft">
      <Navbar />

      <main className="flex-grow-1 d-flex align-items-center justify-content-center pt-5 mt-5 pb-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5 col-xl-4">

              <div className="card border-0 shadow-sm rounded-3 p-4 bg-white">
                <div className="card-body">
                  <h3 className="fw-bold text-center text-brand mb-1">Welcome Back</h3>
                  <p className="text-center text-secondary mb-4 small">Log in to continue your learning journey.</p>

                  {error && <div className="alert alert-danger py-2 small">{error}</div>}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      {/* 3. Update the label and input to Email */}
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

                    <div className="mb-4">
                      <div className="d-flex justify-content-between">
                        <label className="form-label fw-medium text-dark small">Password</label>
                        <a href="#" className="text-brand small text-decoration-none">Forgot password?</a>
                      </div>
                      <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                      />
                    </div>

                    <button type="submit" className="btn btn-brand w-100 mb-3 py-2">
                      Log In
                    </button>
                  </form>

                  <div className="text-center mt-3">
                    <p className="text-secondary small mb-0">
                      Don't have an account? <Link to="/register" className="text-brand text-decoration-none fw-medium">Sign up</Link>
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

export default LoginPage;