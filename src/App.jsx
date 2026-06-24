import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import AchievementsPage from './pages/AchievementsPage';
import ApplicationsPage from './pages/ApplicationsPage';
import ProfilePage from './pages/ProfilePage';
import AdminApplicationsPage from './pages/AdminApplicationsPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="dashboard" element={<DashboardHome />} />
        <Route path="achievements" element={<AchievementsPage />} />
        <Route path="applications" element={<ApplicationsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="admin/applications" element={<AdminApplicationsPage />} />
      </Route>
    </Routes>
  );
}

export default App;