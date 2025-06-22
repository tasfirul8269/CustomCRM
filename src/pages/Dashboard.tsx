import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import {
  Users,
  BookOpen,
  Calendar,
  Award,
  ArrowRight,
  UserPlus,
  PlusCircle,
  Building,
  MapPin,
  Activity,
  Briefcase,
  BarChart3,
} from 'lucide-react';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const [
        studentsRes,
        coursesRes,
        batchesRes,
        certificationsRes,
        employeesRes,
        vendorsRes,
        locationsRes,
      ] = await Promise.all([
        api.get('/students'),
        api.get('/courses'),
        api.get('/batches'),
        api.get('/certificates'),
        api.get('/employees'),
        api.get('/vendors'),
        api.get('/locations'),
      ]);

      const students = studentsRes.data;
      const courses = coursesRes.data;
      const batches = batchesRes.data;
      const certifications = certificationsRes.data;
      const employees = employeesRes.data;
      const vendors = vendorsRes.data;
      const locations = locationsRes.data;

      setStats({
        students: {
          total: students.length,
          active: students.filter((s: any) => s.status === 'active').length,
          pending: students.filter((s: any) => s.status === 'pending').length,
        },
        courses: {
          total: courses.length,
          active: courses.filter((c: any) => c.status === 'active').length,
          inactive: courses.filter((c: any) => c.status === 'inactive').length,
        },
        batches: {
          total: batches.length,
          published: batches.filter((b: any) => b.status === 'published').length,
          draft: batches.filter((b: any) => b.status === 'draft').length,
        },
        certifications: {
          total: certifications.length,
          pending: certifications.filter((c: any) => c.status === 'pending').length,
          issued: certifications.filter((c: any) => c.status === 'issued').length,
        },
        employees: {
          total: employees.length,
          live: employees.filter((e: any) => e.status === 'Live').length,
          inactive: employees.filter((e: any) => e.status === 'Inactive').length,
        },
        vendors: {
          total: vendors.length,
          published: vendors.filter((v: any) => v.published).length,
          unpublished: vendors.filter((v: any) => !v.published).length,
        },
        locations: {
          total: locations.length,
        },
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const quickActions = [
    {
      title: 'Add Student',
      description: 'Register new student',
      icon: UserPlus,
      action: () => navigate('/students'),
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      title: 'Create Course',
      description: 'Add new course',
      icon: PlusCircle,
      action: () => navigate('/courses'),
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      title: 'Schedule Batch',
      description: 'Create new batch',
      icon: Calendar,
      action: () => navigate('/batches'),
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      title: 'Process Certificates',
      description: 'Manage certifications',
      icon: Award,
      action: () => navigate('/certifications'),
      color: 'bg-yellow-500 hover:bg-yellow-600',
    },
    {
      title: 'Add Employee',
      description: 'Register new employee',
      icon: Briefcase,
      action: () => navigate('/employees'),
      color: 'bg-indigo-500 hover:bg-indigo-600',
    },
    {
      title: 'Add Vendor',
      description: 'Register new vendor',
      icon: Building,
      action: () => navigate('/vendors'),
      color: 'bg-orange-500 hover:bg-orange-600',
    },
    {
      title: 'Add Location',
      description: 'Add new location',
      icon: MapPin,
      action: () => navigate('/locations'),
      color: 'bg-red-500 hover:bg-red-600',
    },
    {
      title: 'View Reports',
      description: 'Analytics & reports',
      icon: BarChart3,
      action: () => navigate('/reports'),
      color: 'bg-gray-500 hover:bg-gray-600',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's your comprehensive overview.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button onClick={fetchDashboardData} variant="outline" size="sm">
            <Activity className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.students.total || 0}</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm font-medium text-green-600">
                    {stats?.students.active || 0} active
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    {stats?.students.pending || 0} pending
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-blue-500">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Courses</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.courses.active || 0}</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm font-medium text-green-600">
                    {stats?.courses.total || 0} total
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    {stats?.courses.inactive || 0} inactive
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-green-500">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Certificates</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.certifications.pending || 0}</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm font-medium text-yellow-600">
                    {stats?.certifications.total || 0} total
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    {stats?.certifications.issued || 0} issued
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-red-500">
                <Award className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Batches</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.batches.published || 0}</p>
                <p className="text-xs text-gray-500">{stats?.batches.total || 0} total</p>
              </div>
              <div className="p-2 rounded-full bg-purple-500">
                <Calendar className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Employees</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.employees.live || 0}</p>
                <p className="text-xs text-gray-500">{stats?.employees.total || 0} total</p>
              </div>
              <div className="p-2 rounded-full bg-indigo-500">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vendors</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.vendors.published || 0}</p>
                <p className="text-xs text-gray-500">{stats?.vendors.total || 0} total</p>
              </div>
              <div className="p-2 rounded-full bg-orange-500">
                <Building className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Locations</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.locations.total || 0}</p>
                <p className="text-xs text-gray-500">Active centers</p>
              </div>
              <div className="p-2 rounded-full bg-red-500">
                <MapPin className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <div
                key={index}
                onClick={action.action}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 cursor-pointer transition-all duration-200 group"
              >
                <div className={`p-2 rounded-lg ${action.color} w-fit mb-3`}>
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors mt-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">System Performance</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Student Enrollment Rate</span>
                  <span className="text-sm font-bold text-gray-900">
                    {stats?.students.total ? Math.round((stats.students.active / stats.students.total) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                    style={{ 
                      width: `${stats?.students.total ? (stats.students.active / stats.students.total) * 100 : 0}%` 
                    }} 
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Course Completion Rate</span>
                  <span className="text-sm font-bold text-gray-900">
                    {stats?.certifications.total ? Math.round((stats.certifications.issued / stats.certifications.total) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                    style={{ 
                      width: `${stats?.certifications.total ? (stats.certifications.issued / stats.certifications.total) * 100 : 0}%` 
                    }} 
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Quick Stats</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-sm font-medium text-gray-700">Total Students</span>
                </div>
                <span className="text-lg font-bold text-blue-600">{stats?.students.total || 0}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-sm font-medium text-gray-700">Active Courses</span>
                </div>
                <span className="text-lg font-bold text-green-600">{stats?.courses.active || 0}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-purple-600 mr-3" />
                  <span className="text-sm font-medium text-gray-700">Published Batches</span>
                </div>
                <span className="text-lg font-bold text-purple-600">{stats?.batches.published || 0}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-yellow-600 mr-3" />
                  <span className="text-sm font-medium text-gray-700">Pending Certificates</span>
                </div>
                <span className="text-lg font-bold text-yellow-600">{stats?.certifications.pending || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 