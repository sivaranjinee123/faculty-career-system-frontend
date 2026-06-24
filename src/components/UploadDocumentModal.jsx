import { useState } from 'react';
import { X, Upload, FileText } from 'lucide-react';
import { uploadDocument } from '../services/documentService';
import toast from 'react-hot-toast';

function UploadDocumentModal({ achievementId, achievementTitle, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && !selected.name.toLowerCase().endsWith('.pdf')) {
      setError('Only PDF files are allowed');
      setFile(null);
      return;
    }
    setError('');
    setFile(selected);
  };

  const handleUpload = async (e) => {
  e.preventDefault();
  if (!file) {
    setError('Please select a PDF file');
    return;
  }
  setUploading(true);
  setError('');
  try {
    await uploadDocument(achievementId, file);
    toast.success('Certificate uploaded');
    onSuccess();
  } catch (err) {
    const message = err.response?.data?.message 
      || 'Upload failed. Please try again.';
    setError(message);
    toast.error(message);
  } finally {
    setUploading(false);
  }
};

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">

        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-gray-800">
            Upload Certificate
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-5">
          For: <span className="font-medium text-gray-700">{achievementTitle}</span>
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleUpload}>

          <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-8 cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            {file ? (
              <>
                <FileText className="text-purple-600" size={32} />
                <p className="text-sm font-medium text-gray-700">{file.name}</p>
                <p className="text-xs text-gray-400">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </>
            ) : (
              <>
                <Upload className="text-gray-400" size={32} />
                <p className="text-sm text-gray-500">
                  Click to select a PDF file
                </p>
              </>
            )}
          </label>

          <button
            type="submit"
            disabled={uploading || !file}
            className="w-full mt-4 bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload Certificate'}
          </button>

        </form>

      </div>
    </div>
  );
}

export default UploadDocumentModal;