import { useState, useEffect } from 'react';
import { Mail, Building2, Shield, Loader2, Pencil, Lock, X, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { getCurrentUser, updateProfile, changePassword } from '../services/userService';
import { getMyAchievements, getTotalPoints } from '../services/achievementService';
import { useAuth } from '../context/AuthContext';

function ProfilePage() {
  const { user: authUser, reloadUser } = useAuth();
  const isAdmin = authUser?.role === 'ADMIN';

  const [user, setUser] = useState(null);
  const [achievementCount, setAchievementCount] = useState(0);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  // Edit details state
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [savingDetails, setSavingDetails] = useState(false);

  // Change password state
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
 const [showCurrentPassword, setShowCurrentPassword] = useState(false);
 const [showNewPassword, setShowNewPassword] = useState(false);
 const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      if (isAdmin) {
        const userData = await getCurrentUser();
        setUser(userData);
        setName(userData.name);
        setDepartment(userData.department);
      } else {
        const [userData, achievements, pointsData] = await Promise.all([
          getCurrentUser(),
          getMyAchievements(),
          getTotalPoints()
        ]);
        setUser(userData);
        setName(userData.name);
        setDepartment(userData.department);
        setAchievementCount(achievements.length);
        setPoints(pointsData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDetails = async (e) => {
    e.preventDefault();
    setSavingDetails(true);
    try {
      const updated = await updateProfile(name, department);
      setUser(updated);
      await reloadUser(); // refresh sidebar name too
      toast.success('Profile updated');
      setIsEditingDetails(false);
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSavingDetails(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    setSavingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast.success('Password changed successfully');
      setIsChangingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to change password';
      toast.error(message);
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-600" size={40} />
      </div>
    );
  }

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="p-8 max-w-7xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Profile</h1>
      <p className="text-gray-500 mb-8">Your account information</p>

      <div className="bg-white rounded-2xl border border-gray-100 p-8">

        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center text-white text-xl font-bold">
            {initials}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">{user.name}</h2>
            <span className="text-xs font-semibold bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full">
              {user.role}
            </span>
          </div>
        </div>

        {/* Details — view or edit mode */}
        {isEditingDetails ? (
          <form onSubmit={handleSaveDetails} className="space-y-3 mb-6">
            <div>
              <label className="text-xs text-gray-400">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full mt-1 p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
                className="w-full mt-1 p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={savingDetails}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition disabled:opacity-50"
              >
                {savingDetails ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditingDetails(false);
                  setName(user.name);
                  setDepartment(user.department);
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 mb-2">
            <div className="flex items-center gap-3 py-3 border-b border-gray-100">
              <Mail className="text-gray-400" size={18} />
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-sm font-medium text-gray-700">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 py-3 border-b border-gray-100">
              <Building2 className="text-gray-400" size={18} />
              <div>
                <p className="text-xs text-gray-400">Department</p>
                <p className="text-sm font-medium text-gray-700">{user.department}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 py-3">
              <Shield className="text-gray-400" size={18} />
              <div>
                <p className="text-xs text-gray-400">Role</p>
                <p className="text-sm font-medium text-gray-700">{user.role}</p>
              </div>
            </div>
          </div>
        )}

        {!isEditingDetails && (
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => setIsEditingDetails(true)}
              className="flex items-center gap-1.5 text-sm font-medium text-purple-600 hover:text-purple-700 transition"
            >
              <Pencil size={14} />
              Edit Details
            </button>
            <span className="text-gray-300">•</span>
            <button
              onClick={() => setIsChangingPassword(!isChangingPassword)}
              className="flex items-center gap-1.5 text-sm font-medium text-purple-600 hover:text-purple-700 transition"
            >
              <Lock size={14} />
              Change Password
            </button>
          </div>
        )}

        {/* Change password form */}
        {isChangingPassword && (
          <form onSubmit={handleChangePassword} className="space-y-3 mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold text-gray-700">Change Password</h3>
              <button
                type="button"
                onClick={() => setIsChangingPassword(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>

            <div className="relative">
  <input
    type={showCurrentPassword ? 'text' : 'password'}
    placeholder="Current password"
    value={currentPassword}
    onChange={(e) => setCurrentPassword(e.target.value)}
    required
    className="w-full p-2.5 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
  />
  <button
    type="button"
    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
  >
    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
  </button>
</div>

<div className="relative">
  <input
    type={showNewPassword ? 'text' : 'password'}
    placeholder="New password"
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
    required
    minLength={6}
    className="w-full p-2.5 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
  />
  <button
    type="button"
    onClick={() => setShowNewPassword(!showNewPassword)}
    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
  >
    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
  </button>
</div>

<div className="relative">
  <input
    type={showConfirmPassword ? 'text' : 'password'}
    placeholder="Confirm new password"
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    required
    className="w-full p-2.5 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
  />
  <button
    type="button"
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
  >
    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
  </button>
</div>
            <button
              type="submit"
              disabled={savingPassword}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition disabled:opacity-50"
            >
              {savingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}

        {!isAdmin && (
          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-purple-600">{points}</p>
              <p className="text-xs text-gray-500 mt-1">Total Points</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-orange-500">{achievementCount}</p>
              <p className="text-xs text-gray-500 mt-1">Achievements</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default ProfilePage;