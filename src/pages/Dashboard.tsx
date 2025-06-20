import React from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import {
  Users,
  BookOpen,
  DollarSign,
  Calendar,
  Award,
  TrendingUp,
  ArrowRight,
  UserPlus,
  PlusCircle,
} from 'lucide-react';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Total Students',
      value: '2,847',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Courses',
      value: '24',
      change: '+3',
      changeType: 'positive',
      icon: BookOpen,
      color: 'bg-green-500',
    },
    {
      title: 'Monthly Revenue',
      value: '$84,250',
      change: '+8.2%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'bg-yellow-500',
    },
    {
      title: 'Active Batches',
      value: '18',
      change: '+2',
      changeType: 'positive',
      icon: Calendar,
      color: 'bg-purple-500',
    },
    {
      title: 'Certificates Pending',
      value: '156',
      change: '-5',
      changeType: 'negative',
      icon: Award,
      color: 'bg-red-500',
    },
    {
      title: 'Growth Rate',
      value: '23.5%',
      change: '+4.1%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'bg-indigo-500',
    },
  ];

  const quickActions = [
    {
      title: 'Add New Student',
      description: 'Register a new student with admission form',
      icon: UserPlus,
      action: () => navigate('/students'),
      color: 'bg-blue-500',
    },
    {
      title: 'Create Course',
      description: 'Add a new course to the catalog',
      icon: PlusCircle,
      action: () => navigate('/courses'),
      color: 'bg-green-500',
    },
    {
      title: 'Schedule Batch',
      description: 'Create a new batch for existing courses',
      icon: Calendar,
      action: () => navigate('/batches'),
      color: 'bg-purple-500',
    },
    {
      title: 'Process Certificates',
      description: 'Review and dispatch pending certificates',
      icon: Award,
      action: () => navigate('/certifications'),
      color: 'bg-yellow-500',
    },
  ];

  const recentActivities = [
    { type: 'Student Registration', name: 'John Doe enrolled in React Fundamentals', time: '2 hours ago' },
    { type: 'Course Completion', name: 'Alice Smith completed JavaScript Advanced', time: '4 hours ago' },
    { type: 'Payment Received', name: '$450 payment from Michael Brown', time: '6 hours ago' },
    { type: 'New Batch Created', name: 'React Advanced Batch #12 scheduled', time: '1 day ago' },
    { type: 'Certificate Issued', name: 'Certificate #2847 issued to Sarah Wilson', time: '1 day ago' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your LMS today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span
                      className={`text-sm font-medium ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">from last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
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

      {/* Recent Activities and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                  <p className="text-sm text-gray-600">{activity.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Monthly Performance</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Student Enrollments</span>
                <span className="text-sm font-bold text-gray-900">247</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }} />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Course Completions</span>
                <span className="text-sm font-bold text-gray-900">186</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }} />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Revenue Target</span>
                <span className="text-sm font-bold text-gray-900">$84,250</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '92%' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}