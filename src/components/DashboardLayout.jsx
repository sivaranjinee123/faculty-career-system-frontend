import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Award, FileText, 
  User, LogOut, GraduationCap, ClipboardCheck, Loader2,ChevronLeft, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

function DashboardLayout() {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const facultyNavItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/achievements', icon: Award, label: 'Achievements' },
    { to: '/applications', icon: FileText, label: 'Applications' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  const adminNavItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/applications', icon: ClipboardCheck, label: 'Review Applications' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  const navItems = user?.role === 'ADMIN' ? adminNavItems : facultyNavItems;

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-600" size={32} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">

      {/* Sidebar */}
      <aside className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
  collapsed ? 'w-20' : 'w-64'
}`}>

  {/* Logo + collapse toggle */}
  <div className="flex items-center justify-between px-4 py-5 border-b border-gray-100">
    <div className="flex items-center gap-2 overflow-hidden">
      <div className="bg-gradient-to-br from-purple-600 to-fuchsia-600 p-2 rounded-lg flex-shrink-0">
        <GraduationCap className="text-white" size={20} />
      </div>
      {!collapsed && (
        <span className="font-bold text-gray-800 whitespace-nowrap">
          Career System
        </span>
      )}
    </div>
  </div>

  {/* Collapse toggle button */}
  <button
    onClick={() => setCollapsed(!collapsed)}
    className="flex items-center justify-center mx-3 mt-3 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition border border-gray-200"
  >
    {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
  </button>

  {/* User badge */}
  {!collapsed && (
    <div className="px-6 py-4 border-b border-gray-100 mt-3">
      <p className="text-sm font-medium text-gray-800">{user?.name}</p>
      <span className="text-xs font-semibold text-purple-600">
        {user?.role}
      </span>
    </div>
  )}

  {/* Nav Links */}
  <nav className="flex-1 px-3 py-4 space-y-1">
    {navItems.map(({ to, icon: Icon, label }) => (
      <NavLink
        key={to}
        to={to}
        title={collapsed ? label : undefined}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
            collapsed ? 'justify-center' : ''
          } ${
            isActive
              ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`
        }
      >
        <Icon size={18} className="flex-shrink-0" />
        {!collapsed && label}
      </NavLink>
    ))}
  </nav>

  {/* Logout */}
  <div className="px-3 py-4 border-t border-gray-100">
    <button
      onClick={handleLogout}
      title={collapsed ? 'Logout' : undefined}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition w-full ${
        collapsed ? 'justify-center' : ''
      }`}
    >
      <LogOut size={18} className="flex-shrink-0" />
      {!collapsed && 'Logout'}
    </button>
  </div>

</aside>

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

    </div>
  );
}

export default DashboardLayout;