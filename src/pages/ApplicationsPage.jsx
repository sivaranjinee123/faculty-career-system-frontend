import { useState, useEffect } from 'react';
import { FileText, Plus, Loader2 } from 'lucide-react';
import { getMyApplications } from '../services/promotionService';
import { getTotalPoints } from '../services/achievementService';
import SubmitApplicationModal from '../components/SubmitApplicationModal';

const statusColors = {
  PENDING: 'bg-amber-100 text-amber-700',
  UNDER_REVIEW: 'bg-blue-100 text-blue-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
};

function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [applicationsData, pointsData] = await Promise.all([
        getMyApplications(),
        getTotalPoints()
      ]);
      setApplications(applicationsData);
      setPoints(pointsData);
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

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Applications</h1>
          <p className="text-gray-500 mt-1">Track your promotion applications</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          <Plus size={16} />
          Apply for Promotion
        </button>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <FileText className="text-gray-300 mx-auto mb-3" size={40} />
          <p className="text-gray-400">No applications submitted yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-2xl border border-gray-100 p-6"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {app.currentDesignation} → {app.applyingForDesignation}
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Applied on {new Date(app.appliedAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${statusColors[app.status]}`}>
                  {app.status.replaceAll('_', ' ')}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4">
                {app.statementOfPurpose}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500 pt-3 border-t border-gray-100">
                <span>{app.totalPoints} points at time of applying</span>
              </div>

              {app.adminComment && (
                <div className="mt-4 bg-gray-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                    Admin Comment
                  </p>
                  <p className="text-sm text-gray-700">{app.adminComment}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <SubmitApplicationModal
          currentPoints={points}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            loadData();
          }}
        />
      )}
    </div>
  );
}

export default ApplicationsPage;