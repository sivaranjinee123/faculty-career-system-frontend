import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { evaluateFaculty } from '../services/aiService';

function AiEvaluationCard() {
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEvaluate = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await evaluateFaculty();
      setEvaluation(data);
    } catch (err) {
      setError('Could not generate evaluation. Add achievements first.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-purple-100 rounded-2xl p-6 mt-6">

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Sparkles className="text-purple-600" size={20} />
          AI Promotion Evaluation
        </h2>

        <button
          onClick={handleEvaluate}
          disabled={loading}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <Sparkles size={16} />
          )}
          {loading ? 'Analyzing...' : 'Get AI Evaluation'}
        </button>
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-4">{error}</p>
      )}

      {evaluation && (
        <div className="mt-5 space-y-4">

          <div className="bg-white rounded-xl p-4">
            <p className="text-xs font-semibold text-purple-600 uppercase mb-1">
              Eligibility
            </p>
            <p className="text-gray-700">{evaluation.eligibilityAssessment}</p>
          </div>

          <div className="bg-white rounded-xl p-4">
            <p className="text-xs font-semibold text-green-600 uppercase mb-1">
              Strengths
            </p>
            <p className="text-gray-700">{evaluation.strengths}</p>
          </div>

          <div className="bg-white rounded-xl p-4">
            <p className="text-xs font-semibold text-amber-600 uppercase mb-1">
              Areas to Improve
            </p>
            <p className="text-gray-700">{evaluation.areasToImprove}</p>
          </div>

          <div className="bg-white rounded-xl p-4">
            <p className="text-xs font-semibold text-blue-600 uppercase mb-1">
              Recommendation
            </p>
            <p className="text-gray-700">{evaluation.recommendation}</p>
          </div>

        </div>
      )}

    </div>
  );
}

export default AiEvaluationCard;