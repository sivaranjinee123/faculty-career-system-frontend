import { useState, useEffect } from 'react';
import { Award, Plus, Loader2, Pencil, Trash2, Upload, FileText, Download } from 'lucide-react';
import { getMyAchievements, deleteAchievement } from '../services/achievementService';
import { getDocumentsByAchievement, downloadDocument } from '../services/documentService';
import AddAchievementModal from '../components/AddAchievementModal';
import UploadDocumentModal from '../components/UploadDocumentModal';
import toast from 'react-hot-toast';

function AchievementsPage() {
  const [achievements, setAchievements] = useState([]);
  const [documentsMap, setDocumentsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState(null);
  const [uploadingFor, setUploadingFor] = useState(null);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      const data = await getMyAchievements();
      setAchievements(data);

      // Fetch documents for each achievement in parallel
      const docsEntries = await Promise.all(
        data.map(async (a) => {
          const docs = await getDocumentsByAchievement(a.id);
          return [a.id, docs];
        })
      );
      setDocumentsMap(Object.fromEntries(docsEntries));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
  if (!window.confirm('Delete this achievement? This cannot be undone.')) {
    return;
  }
  try {
    await deleteAchievement(id);
    toast.success('Achievement deleted');
    loadAchievements();
  } catch (err) {
    toast.error('Failed to delete achievement');
  }
};

  const handleEdit = (achievement) => {
    setEditingAchievement(achievement);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAchievement(null);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-600" size={40} />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Achievements</h1>
          <p className="text-gray-500 mt-1">Manage your academic accomplishments</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-purple-700 transition"
        >
          <Plus size={16} />
          Add Achievement
        </button>
      </div>

      {achievements.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Award className="text-gray-300 mx-auto mb-3" size={40} />
          <p className="text-gray-400">No achievements yet. Add your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((a) => {
            const docs = documentsMap[a.id] || [];
            const hasDocument = docs.length > 0;

            return (
              <div
                key={a.id}
                className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
                    {a.type.replaceAll('_', ' ')}
                  </span>
                  <span className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">
                    +{a.points} pts
                  </span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">{a.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{a.description}</p>

                {/* Document status */}
                {hasDocument ? (
     <button
    onClick={() => downloadDocument(docs[0].storedFileName, docs[0].originalFileName)}
    className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg mb-4 hover:bg-green-100 transition w-full"
  >
    <FileText size={16} />
    {docs[0].originalFileName}
    <Download size={14} className="ml-auto" />
  </button>
          ) : (
                  <button
                    onClick={() => setUploadingFor(a)}
                    className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg mb-4 hover:bg-gray-100 transition w-full"
                  >
                    <Upload size={16} />
                    Upload Certificate
                  </button>
                )}

                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-400">{a.achievedDate}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(a)}
                      className="text-gray-400 hover:text-purple-600 transition"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="text-gray-400 hover:text-red-600 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <AddAchievementModal
          existingAchievement={editingAchievement}
          onClose={handleCloseModal}
          onSuccess={() => {
            handleCloseModal();
            loadAchievements();
          }}
        />
      )}

      {uploadingFor && (
        <UploadDocumentModal
          achievementId={uploadingFor.id}
          achievementTitle={uploadingFor.title}
          onClose={() => setUploadingFor(null)}
          onSuccess={() => {
            setUploadingFor(null);
            loadAchievements();
          }}
        />
      )}
    </div>
  );
}

export default AchievementsPage;