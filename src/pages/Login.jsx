import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';
import { Mail, Lock, GraduationCap, Eye, EyeOff} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { reloadUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // stops the page from refreshing
    setError('');
    setLoading(true);

    try {
      const token = await login(email, password);
      localStorage.setItem('token', token);
      await reloadUser(); 
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">

        {/* Logo / Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-purple-100 p-4 rounded-full mb-4">
            <GraduationCap className="text-purple-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            Faculty Career System
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Sign in to your account
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="relative">
  <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
  <input
    type={showPassword ? 'text' : 'password'}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
    className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
  />
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
  >
    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>
</div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-purple-600 font-medium hover:underline">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;