import { useState, useEffect } from 'react';
import { TrendingUp, Award, FileText, ClipboardCheck, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getMyAchievements, getTotalPoints } from '../services/achievementService';
import { getMyApplications } from '../services/promotionService';
import { getAllApplications, getPendingApplications } from '../services/adminService';
import AiEvaluationCard from '../components/AiEvaluationCard';

function DashboardHome() {
  const { user } = useAuth();
  const [points, setPoints] = useState(0);
  const [achievementCount, setAchievementCount] = useState(0);
  const [applicationCount, setApplicationCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    if (user) {
      isAdmin ? loadAdminStats() : loadFacultyStats();
    }
  }, [user]);

  const loadFacultyStats = async () => {
    try {
      const [achievements, pointsData, applications] = await Promise.all([
        getMyAchievements(),
        getTotalPoints(),
        getMyApplications()
      ]);
      setAchievementCount(achievements.length);
      setPoints(pointsData);
      setApplicationCount(applications.length);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadAdminStats = async () => {
    try {
      const [allApps, pendingApps] = await Promise.all([
        getAllApplications(),
        getPendingApplications()
      ]);
      setApplicationCount(allApps.length);
      setPendingCount(pendingApps.length);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-600" size={40} />
      </div>
    );
  }

  // ---- ADMIN VIEW ----
  if (isAdmin) {
    return (
      <div className="p-8 max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Welcome back, {user.name} 👋
        </h1>
        <p className="text-gray-500 mb-8">Here's the system overview</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-amber-100 text-sm">Pending Review</p>
                <p className="text-3xl font-bold mt-1">{pendingCount}</p>
              </div>
              <ClipboardCheck size={28} className="text-amber-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-100 text-sm">Total Applications</p>
                <p className="text-3xl font-bold mt-1">{applicationCount}</p>
              </div>
              <FileText size={28} className="text-blue-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---- FACULTY VIEW ----
  return (
    <div className="p-8 max-w-7xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Welcome back 👋</h1>
      <p className="text-gray-500 mb-8">Here's your career progress overview</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-purple-100 text-sm">Total Points</p>
              <p className="text-3xl font-bold mt-1">{points}</p>
            </div>
            <TrendingUp size={28} className="text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-orange-100 text-sm">Achievements</p>
              <p className="text-3xl font-bold mt-1">{achievementCount}</p>
            </div>
            <Award size={28} className="text-orange-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 text-sm">Applications</p>
              <p className="text-3xl font-bold mt-1">{applicationCount}</p>
            </div>
            <FileText size={28} className="text-blue-200" />
          </div>
        </div>
      </div>

      <AiEvaluationCard />
    </div>
  );
}

export default DashboardHome;