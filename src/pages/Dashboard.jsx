import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Award, TrendingUp, FileText, Sparkles, 
  LogOut, Plus, Loader2 
} from 'lucide-react';
import { getMyAchievements, getTotalPoints } from '../services/achievementService';
import { getMyApplications } from '../services/promotionService';
import AddAchievementModal from '../components/AddAchievementModal';
import AiEvaluationCard from '../components/AiEvaluationCard';
import SubmitApplicationModal from '../components/SubmitApplicationModal';

function Dashboard() {
  const [achievements, setAchievements] = useState([]);
  const [points, setPoints] = useState(0);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [achievementsData, pointsData, applicationsData] = 
        await Promise.all([
          getMyAchievements(),
          getTotalPoints(),
          getMyApplications()
        ]);

      setAchievements(achievementsData);
      setPoints(pointsData);
      setApplications(applicationsData);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const statusColors = {
    PENDING: 'bg-amber-100 text-amber-700',
    UNDER_REVIEW: 'bg-blue-100 text-blue-700',
    APPROVED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-purple-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">
          Faculty Career System
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </nav>

      <div className="max-w-6xl mx-auto p-6">

        {/* Stats Cards */}
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
                <p className="text-3xl font-bold mt-1">{achievements.length}</p>
              </div>
              <Award size={28} className="text-orange-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-100 text-sm">Applications</p>
                <p className="text-3xl font-bold mt-1">{applications.length}</p>
              </div>
              <FileText size={28} className="text-blue-200" />
            </div>
          </div>

        </div>

        {/* AI Evaluation Card */}
        <AiEvaluationCard />

        {/* Achievements Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Award className="text-purple-600" size={20} />
              My Achievements
            </h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition"
            >
              <Plus size={16} />
              Add New
            </button>
          </div>

          {achievements.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No achievements yet. Add your first one!
            </p>
          ) : (
            <div className="space-y-3">
              {achievements.map((a) => (
                <div
                  key={a.id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                >
                  <div>
                    <p className="font-medium text-gray-800">{a.title}</p>
                    <p className="text-sm text-gray-500">
                      {a.type.replaceAll('_', ' ')}
                    </p>
                  </div>
                  <span className="bg-purple-100 text-purple-700 text-sm font-semibold px-3 py-1 rounded-full">
                    +{a.points} pts
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Applications Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FileText className="text-blue-600" size={20} />
              My Applications
            </h2>
            <button
              onClick={() => setShowApplyModal(true)}
              className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              <Plus size={16} />
              Apply for Promotion
            </button>
          </div>

          {applications.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No applications submitted yet.
            </p>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-xl"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {app.currentDesignation} → {app.applyingForDesignation}
                    </p>
                    <p className="text-sm text-gray-500">
                      {app.totalPoints} points at time of applying
                    </p>
                  </div>
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full ${statusColors[app.status]}`}>
                    {app.status.replaceAll('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {showAddModal && (
        <AddAchievementModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            loadDashboardData();
          }}
        />
      )}

      {showApplyModal && (
        <SubmitApplicationModal
          currentPoints={points}
          onClose={() => setShowApplyModal(false)}
          onSuccess={() => {
            setShowApplyModal(false);
            loadDashboardData();
          }}
        />
      )}

    </div>
  );
}

export default Dashboard;