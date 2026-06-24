import { useState, useEffect } from 'react';
import { ClipboardCheck, Loader2, Check, X, ChevronDown, ChevronUp, FileText as FileIcon, Award } from 'lucide-react';
import { getAllApplications, reviewApplication } from '../services/adminService';
import { getAchievementsByFacultyEmail } from '../services/achievementService';
import { getDocumentsByAchievement, downloadDocument } from '../services/documentService';
import toast from 'react-hot-toast';

const statusColors = {
  PENDING: 'bg-amber-100 text-amber-700',
  UNDER_REVIEW: 'bg-blue-100 text-blue-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
};

function AdminApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState(null);
  const [comment, setComment] = useState('');
  const [filter, setFilter] = useState('ALL');

  // Evidence panel state
  const [expandedId, setExpandedId] = useState(null);
  const [evidenceMap, setEvidenceMap] = useState({});
  const [loadingEvidence, setLoadingEvidence] = useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const data = await getAllApplications();
      setApplications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id, status) => {
  if (!comment.trim()) {
    toast.error('Please add a comment before reviewing');
    return;
  }
  try {
    await reviewApplication(id, status, comment);
    toast.success(`Application ${status.toLowerCase()}`);
    setReviewingId(null);
    setComment('');
    loadApplications();
  } catch (err) {
    toast.error('Failed to review application');
  }
};

  const toggleEvidence = async (app) => {
    // Collapse if already open
    if (expandedId === app.id) {
      setExpandedId(null);
      return;
    }

    setExpandedId(app.id);

    // Skip re-fetching if already loaded
    if (evidenceMap[app.id]) return;

    setLoadingEvidence(true);
    try {
      const achievements = await getAchievementsByFacultyEmail(app.facultyEmail);

      // Fetch documents for each achievement in parallel
      const docsEntries = await Promise.all(
        achievements.map(async (a) => {
          const docs = await getDocumentsByAchievement(a.id);
          return [a.id, docs];
        })
      );
      const docsMap = Object.fromEntries(docsEntries);

      setEvidenceMap((prev) => ({
        ...prev,
        [app.id]: { achievements, docsMap }
      }));
    } catch (err) {
      console.error('Failed to load evidence', err);
    } finally {
      setLoadingEvidence(false);
    }
  };

  const filteredApplications = filter === 'ALL'
    ? applications
    : applications.filter((a) => a.status === filter);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-600" size={40} />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">
        Review Applications
      </h1>
      <p className="text-gray-500 mb-6">
        Approve or reject faculty promotion requests
      </p>

      <div className="flex gap-2 mb-6">
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === f
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filteredApplications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <ClipboardCheck className="text-gray-300 mx-auto mb-3" size={40} />
          <p className="text-gray-400">No applications found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app) => {
            const isExpanded = expandedId === app.id;
            const evidence = evidenceMap[app.id];

            return (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-gray-100 p-6"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {app.facultyName}
                    </h3>
                    <p className="text-sm text-gray-500">{app.facultyEmail}</p>
                  </div>
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full ${statusColors[app.status]}`}>
                    {app.status.replaceAll('_', ' ')}
                  </span>
                </div>

                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-medium">{app.currentDesignation}</span>
                  {' → '}
                  <span className="font-medium">{app.applyingForDesignation}</span>
                </p>

                <p className="text-sm text-gray-600 mb-3">
                  {app.statementOfPurpose}
                </p>

                <p className="text-xs text-gray-400 mb-4">
                  {app.totalPoints} points • Applied {new Date(app.appliedAt).toLocaleDateString()}
                </p>

                {/* Evidence toggle */}
                <button
                  onClick={() => toggleEvidence(app)}
                  className="flex items-center gap-1.5 text-sm font-medium text-purple-600 hover:text-purple-700 transition mb-2"
                >
                  <Award size={16} />
                  {isExpanded ? 'Hide' : 'View'} Achievements & Evidence
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {isExpanded && (
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    {loadingEvidence && !evidence ? (
                      <div className="flex justify-center py-4">
                        <Loader2 className="animate-spin text-purple-600" size={24} />
                      </div>
                    ) : evidence && evidence.achievements.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-2">
                        No achievements recorded.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {evidence?.achievements.map((a) => {
                          const docs = evidence.docsMap[a.id] || [];
                          return (
                            <div
                              key={a.id}
                              className="bg-white rounded-lg p-3 flex justify-between items-center"
                            >
                              <div>
                                <p className="text-sm font-medium text-gray-800">{a.title}</p>
                                <p className="text-xs text-gray-500">
                                  {a.type.replaceAll('_', ' ')} • +{a.points} pts
                                </p>
                              </div>
                              {docs.length > 0 ? (
                                <button
                                  onClick={() => downloadDocument(docs[0].storedFileName, docs[0].originalFileName)}
                                  className="flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1.5 rounded-lg hover:bg-green-100 transition"
                                >
                                  <FileIcon size={14} />
                                  View Certificate
                                </button>
                              ) : (
                                <span className="text-xs text-gray-400 italic">
                                  No document
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {app.adminComment && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                      Your Comment
                    </p>
                    <p className="text-sm text-gray-700">{app.adminComment}</p>
                  </div>
                )}

                {app.status === 'PENDING' && (
                  <div className="pt-4 border-t border-gray-100">
                    {reviewingId === app.id ? (
                      <div className="space-y-3">
                        <textarea
                          placeholder="Add a comment explaining your decision..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          rows={2}
                          className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReview(app.id, 'APPROVED')}
                            className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition"
                          >
                            <Check size={16} />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReview(app.id, 'REJECTED')}
                            className="flex items-center gap-1 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition"
                          >
                            <X size={16} />
                            Reject
                          </button>
                          <button
                            onClick={() => { setReviewingId(null); setComment(''); }}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setReviewingId(app.id)}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition"
                      >
                        Review Application
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdminApplicationsPage;