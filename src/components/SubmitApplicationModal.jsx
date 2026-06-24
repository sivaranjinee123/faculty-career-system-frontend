import { useState } from 'react';
import { X, Send } from 'lucide-react';
import { submitApplication } from '../services/promotionService';
import toast from 'react-hot-toast';

function SubmitApplicationModal({ currentPoints, onClose, onSuccess }) {
  const [currentDesignation, setCurrentDesignation] = useState('');
  const [applyingForDesignation, setApplyingForDesignation] = useState('');
  const [statementOfPurpose, setStatementOfPurpose] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await submitApplication({
        currentDesignation,
        applyingForDesignation,
        statementOfPurpose
      });
      toast.success('Application submitted');
      onSuccess();
    } catch (err) {
      // Reads the message your GlobalExceptionHandler sends back
      const message = err.response?.data?.message 
        || 'Failed to submit application';
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg">

        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-gray-800">
            Submit Promotion Application
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-5">
          Current total points: <span className="font-semibold text-purple-600">{currentPoints}</span>
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Current Designation (e.g. Assistant Professor)"
            value={currentDesignation}
            onChange={(e) => setCurrentDesignation(e.target.value)}
            required
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="text"
            placeholder="Applying For (e.g. Associate Professor)"
            value={applyingForDesignation}
            onChange={(e) => setApplyingForDesignation(e.target.value)}
            required
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <textarea
            placeholder="Statement of Purpose — why do you deserve this promotion?"
            value={statementOfPurpose}
            onChange={(e) => setStatementOfPurpose(e.target.value)}
            rows={4}
            required
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            <Send size={16} />
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>

        </form>

      </div>
    </div>
  );
}

export default SubmitApplicationModal;