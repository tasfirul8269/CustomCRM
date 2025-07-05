import React, { useState, useEffect } from 'react';
import CourseForm from '../components/forms/CourseForm';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Course } from '../types';
import { Plus, Search, Filter, Eye, Edit, Trash2, Users, Clock, ChevronDown } from 'lucide-react';
import api from '../services/api';

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch courses from API
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/courses');
      setCourses(response.data);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.filter-dropdown-container')) {
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredCourses = courses.filter(course => {
    // Search filter
    const searchMatch = 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseCode.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const statusMatch = 
      statusFilter === 'all' ||
      course.status === statusFilter;

    return searchMatch && statusMatch;
  });

  const handleAddCourse = async (courseData: any) => {
    try {
      setMessage('');
      setError('');
      // Map form data to backend expected format
      const mappedData = {
        title: courseData.courseTitle,
        courseCode: courseData.courseCode,
        assignmentDuration: courseData.assignmentDuration,
        status: courseData.published ? 'active' : 'inactive'
      };
      await api.post('/courses', mappedData);
      setMessage('Course added successfully!');
      fetchCourses(); // Refresh the list
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add course');
    }
  };

  const handleEditCourse = async (courseData: any) => {
    try {
      setMessage('');
      setError('');
      if (editingCourse) {
        // Map form data to backend expected format
        const mappedData = {
          title: courseData.courseTitle,
          courseCode: courseData.courseCode,
          assignmentDuration: courseData.assignmentDuration,
          status: courseData.published ? 'active' : 'inactive'
        };
        await api.patch(`/courses/${editingCourse.id}`, mappedData);
        setMessage('Course updated successfully!');
        fetchCourses(); // Refresh the list
        setIsModalOpen(false);
        setEditingCourse(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update course');
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      try {
        setMessage('');
        setError('');
        await api.delete(`/courses/${id}`);
        setMessage('Course deleted successfully!');
        fetchCourses(); // Refresh the list
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete course');
      }
    }
  };

  const openModal = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
    } else {
      setEditingCourse(null);
    }
    setIsModalOpen(true);
    setMessage('');
    setError('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
    setMessage('');
    setError('');
  };

  const getStatusBadge = (status: Course['status']) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
    };
    return `px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-600 mt-2">Manage your course catalog and track enrollments</p>
        </div>
        <Button onClick={() => openModal()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </Button>
      </div>

      {/* Messages */}
      {message && (
        <div className="p-4 bg-green-100 text-green-700 rounded-md">
          {message}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {searchTerm || statusFilter !== 'all' ? 'Filtered Courses' : 'Total Courses'}
                </p>
                <p className="text-3xl font-bold text-gray-900">{filteredCourses.length}</p>
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
                  {filteredCourses.filter(c => c.status === 'active').length}
                </p>
              </div>
              <div className="p-3 bg-green-500 rounded-full">
                <Eye className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses by title or course code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>
            
            <div className="relative filter-dropdown-container">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
              
              {showFilterDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Course Status</h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="statusFilter"
                          value="all"
                          checked={statusFilter === 'all'}
                          onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">All Courses</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="statusFilter"
                          value="active"
                          checked={statusFilter === 'active'}
                          onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Active Only</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="statusFilter"
                          value="inactive"
                          checked={statusFilter === 'inactive'}
                          onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Inactive Only</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Summary */}
      {(searchTerm || statusFilter !== 'all') && (
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Active filters:</span>
          {searchTerm && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
              Search: "{searchTerm}"
            </span>
          )}
          {statusFilter !== 'all' && (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
              {statusFilter === 'active' ? 'Active Only' : 'Inactive Only'}
            </span>
          )}
          <button 
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}
            className="text-red-600 hover:text-red-800 underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course, index) => (
          <Card key={course.id || `course-${index}`} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{course.title}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={getStatusBadge(course.status)}>
                      {course.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openModal(course)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-1" />
                    Course Code
                  </div>
                  <span className="text-sm font-medium text-gray-900">{course.courseCode}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    Assignment Duration
                  </div>
                  <span className="text-sm font-medium text-gray-900">{course.assignmentDuration} days</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingCourse ? 'Edit Course' : 'Add New Course'}
      >
        <CourseForm
          onSubmit={editingCourse ? handleEditCourse : handleAddCourse}
          onCancel={closeModal}
          initialData={editingCourse}
        />
      </Modal>
    </div>
  );
}