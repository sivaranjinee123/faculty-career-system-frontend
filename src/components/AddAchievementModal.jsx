import { useState } from 'react';
import { X } from 'lucide-react';
import { addAchievement, updateAchievement } from '../services/achievementService';
import toast from 'react-hot-toast';

const ACHIEVEMENT_TYPES = [
  'RESEARCH_PAPER', 'PATENT', 'WORKSHOP', 
  'CERTIFICATION', 'CONFERENCE', 'JOURNAL'
];

function AddAchievementModal({ existingAchievement, onClose, onSuccess }) {
  const isEditing = !!existingAchievement;

  const [type, setType] = useState(existingAchievement?.type || 'RESEARCH_PAPER');
  const [title, setTitle] = useState(existingAchievement?.title || '');
  const [description, setDescription] = useState(existingAchievement?.description || '');
  const [achievedDate, setAchievedDate] = useState(existingAchievement?.achievedDate || '');
  const [submitting, setSubmitting] = useState(false);

 const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);
  try {
    const payload = { type, title, description, achievedDate };
    if (isEditing) {
      await updateAchievement(existingAchievement.id, payload);
      toast.success('Achievement updated');
    } else {
      await addAchievement(payload);
      toast.success('Achievement added');
    }
    onSuccess();
  } catch (err) {
    toast.error('Failed to save achievement');
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">

        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold text-gray-800">
            {isEditing ? 'Edit Achievement' : 'Add Achievement'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {ACHIEVEMENT_TYPES.map((t) => (
              <option key={t} value={t}>{t.replaceAll('_', ' ')}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="date"
            value={achievedDate}
            onChange={(e) => setAchievedDate(e.target.value)}
            required
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-50"
          >
            {submitting 
              ? (isEditing ? 'Updating...' : 'Adding...') 
              : (isEditing ? 'Update Achievement' : 'Add Achievement')}
          </button>

        </form>

      </div>
    </div>
  );
}

export default AddAchievementModal;