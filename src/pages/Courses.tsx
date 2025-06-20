import React, { useState } from 'react';
import CourseForm from '../components/forms/CourseForm';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Course } from '../types';
import { Plus, Search, Filter, Eye, Edit, Trash2, Users, DollarSign, Clock } from 'lucide-react';

export default function Courses() {
  const [courses] = useState<Course[]>([
    {
      id: '1',
      title: 'React Fundamentals',
      description: 'Learn the basics of React including components, state, and props',
      price: 599,
      duration: '8 weeks',
      instructor: 'John Smith',
      category: 'Frontend Development',
      status: 'active',
      enrolledStudents: 45,
      maxCapacity: 50,
    },
    {
      id: '2',
      title: 'JavaScript Advanced',
      description: 'Deep dive into advanced JavaScript concepts and patterns',
      price: 799,
      duration: '10 weeks',
      instructor: 'Sarah Johnson',
      category: 'Programming',
      status: 'active',
      enrolledStudents: 32,
      maxCapacity: 40,
    },
    {
      id: '3',
      title: 'Python for Beginners',
      description: 'Start your programming journey with Python',
      price: 499,
      duration: '6 weeks',
      instructor: 'Mike Davis',
      category: 'Programming',
      status: 'active',
      enrolledStudents: 28,
      maxCapacity: 35,
    },
    {
      id: '4',
      title: 'UI/UX Design Masterclass',
      description: 'Complete guide to user interface and experience design',
      price: 899,
      duration: '12 weeks',
      instructor: 'Emily Chen',
      category: 'Design',
      status: 'active',
      enrolledStudents: 15,
      maxCapacity: 25,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddCourseForm, setShowAddCourseForm] = useState(false);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(courses.map(course => course.category)));

  const handleAddCourse = (data: any) => {
    // Here you would typically make an API call to add the course
    console.log('Adding course:', data);
    // For now, we'll just close the form
    setShowAddCourseForm(false);
  };

  const getStatusBadge = (status: Course['status']) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
    };
    return `px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`;
  };

  const getCapacityColor = (enrolled: number, max: number) => {
    const percentage = (enrolled / max) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-600 mt-2">Manage your course catalog and track enrollments</p>
        </div>
        <Button onClick={() => setShowAddCourseForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-3xl font-bold text-gray-900">{courses.length}</p>
              </div>
              <div className="p-3 bg-blue-500 rounded-full">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Courses</p>
                <p className="text-3xl font-bold text-gray-900">
                  {courses.filter(c => c.status === 'active').length}
                </p>
              </div>
              <div className="p-3 bg-green-500 rounded-full">
                <Eye className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-3xl font-bold text-gray-900">
                  {courses.reduce((sum, course) => sum + course.enrolledStudents, 0)}
                </p>
              </div>
              <div className="p-3 bg-purple-500 rounded-full">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Price</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${Math.round(courses.reduce((sum, course) => sum + course.price, 0) / courses.length)}
                </p>
              </div>
              <div className="p-3 bg-yellow-500 rounded-full">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Course Form Modal */}
      {showAddCourseForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add New Course</h2>
                <button 
                  onClick={() => setShowAddCourseForm(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <CourseForm 
                onSubmit={handleAddCourse} 
                onCancel={() => setShowAddCourseForm(false)} 
              />
            </div>
          </div>
        </div>
      )}

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{course.description}</p>
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                    {course.category}
                  </span>
                </div>
                <span className={getStatusBadge(course.status)}>
                  {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                </span>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-gray-600">
                    <DollarSign className="h-4 w-4 mr-1" />
                    Price
                  </span>
                  <span className="font-semibold text-gray-900">${course.price}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    Duration
                  </span>
                  <span className="text-gray-900">{course.duration}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-1" />
                    Enrolled
                  </span>
                  <span className={`font-medium ${getCapacityColor(course.enrolledStudents, course.maxCapacity)}`}>
                    {course.enrolledStudents}/{course.maxCapacity}
                  </span>
                </div>
                
                <div className="pt-2">
                  <div className="text-sm text-gray-600 mb-1">Instructor: {course.instructor}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(course.enrolledStudents / course.maxCapacity) * 100}%` 
                      }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-900 transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900 transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No courses found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}