import React from 'react';
import { NavLink } from 'react-router-dom';
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
  GraduationCap
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Students', href: '/students', icon: Users },
  { name: 'Locations', href: '/locations', icon: MapPin },
  { name: 'Vendors', href: '/vendors', icon: Truck },
  { name: 'Courses', href: '/courses', icon: BookOpen },
  { name: 'Batches', href: '/batches', icon: Calendar },
  { name: 'Certification Dispatch', href: '/certifications', icon: Award },
  { name: 'Employees', href: '/employees', icon: UserCheck },
  { name: 'E-Marketing', href: '/marketing', icon: TrendingUp },
  { name: 'Reports', href: '/reports', icon: FileBarChart },
];

export default function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      <div className="flex h-16 items-center justify-center border-b border-gray-200 px-6">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">LMS Admin</span>
        </div>
      </div>
      
      <nav className="flex-1 space-y-1 px-4 py-6">
        {navigation.map((item) => (
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
    </div>
  );
}