import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  MapPin,
  Truck,
  BookOpen,
  Calendar,
  Award,
  UserCheck,
  TrendingUp,
  FileBarChart,
  GraduationCap,
  LogOut,
  Settings
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, permission: null }, // Always visible
  { name: 'Students', href: '/students', icon: Users, permission: 'students' },
  { name: 'Locations', href: '/locations', icon: MapPin, permission: 'locations' },
  { name: 'Vendors', href: '/vendors', icon: Truck, permission: 'vendors' },
  { name: 'Courses', href: '/courses', icon: BookOpen, permission: 'courses' },
  { name: 'Batches', href: '/batches', icon: Calendar, permission: 'batches' },
  { name: 'Certification Dispatch', href: '/certifications', icon: Award, permission: 'certifications' },
  { name: 'Employees', href: '/employees', icon: UserCheck, permission: 'employees' },
  { name: 'Reports', href: '/reports', icon: FileBarChart, permission: 'reports' },
];

export default function Sidebar() {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }

  const { user, logout, hasPermission } = authContext;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredNavigation = navigation.filter(item => {
    if (!item.permission) return true; // Always show items without permission requirement
    if (user?.role === 'admin') return true; // Admin can see everything
    return hasPermission(item.permission, 'read');
  });

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      <div className="flex h-16 items-center justify-center border-b border-gray-200 px-6">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">LMS Admin</span>
        </div>
      </div>
      
      <nav className="flex-1 space-y-1 px-4 py-6">
        {filteredNavigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon
              className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200`}
            />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* User info and logout */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
            {user?.profileImage ? (
              <img 
                src={user.profileImage} 
                alt={user.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium text-blue-600">
                {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name || user?.email}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {user?.role}
            </p>
          </div>
        </div>
        
        {user?.role === 'admin' && (
          <NavLink
            to="/user-management"
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors duration-200 mb-2"
          >
            <Settings className="mr-3 h-4 w-4" />
            User Management
          </NavLink>
        )}
        
        <button
          onClick={handleLogout}
          className="flex w-full items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors duration-200"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}