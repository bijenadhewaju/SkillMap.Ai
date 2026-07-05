import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RoadmapPage from "./pages/DashboardPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ProfileSetupPage from "./pages/ProfileSetupPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile-setup" element={<ProfileSetupPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />

      </Routes>
    </Router>
  );
}

export default App;