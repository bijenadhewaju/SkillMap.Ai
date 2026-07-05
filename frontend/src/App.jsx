import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';


function App() {
  return (
    <Router>
      <Routes>
        {/* The Landing Page loads on the root URL */}
        <Route path="/" element={<LandingPage />} />

        {/* Placeholder for our next task! */}
        <Route path="/login" element={<div className="container text-center mt-5"><h2>Login UI Coming Soon</h2></div>} />
      </Routes>
    </Router>
  );
}

export default App;