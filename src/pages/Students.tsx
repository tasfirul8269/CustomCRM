import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import StudentAdmissionForm from '../components/forms/StudentAdmissionForm';
import { Student } from '../types';
import { Plus, Search, Eye, Edit, Trash2, Calendar, MapPin, Phone, Mail, DollarSign, User, BookOpen, FileText, CreditCard } from 'lucide-react';
import api from '../services/api';

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch students from API
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/students');
      setStudents(response.data);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddStudent = async (studentData: Omit<Student, 'id'>) => {
    try {
      setMessage('');
      setError('');
      await api.post('/students', studentData);
      setMessage('Student added successfully!');
      fetchStudents(); // Refresh the list
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add student');
    }
  };

  const handleEditStudent = async (studentData: Omit<Student, 'id'>) => {
    try {
      setMessage('');
      setError('');
      if (editingStudent) {
        await api.patch(`/students/${editingStudent.id}`, studentData);
        setMessage('Student updated successfully!');
        fetchStudents(); // Refresh the list
        setIsModalOpen(false);
        setEditingStudent(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update student');
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      try {
        setMessage('');
        setError('');
        await api.delete(`/students/${id}`);
        setMessage('Student deleted successfully!');
        fetchStudents(); // Refresh the list
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete student');
      }
    }
  };

  const openModal = (student?: Student) => {
    if (student) {
      setEditingStudent(student);
    } else {
      setEditingStudent(null);
    }
    setIsModalOpen(true);
    setMessage('');
    setError('');
  };

  const openViewModal = (student: Student) => {
    setViewingStudent(student);
    setIsViewModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
    setMessage('');
    setError('');
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setViewingStudent(null);
  };

  const getStatusBadge = (status: Student['status']) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      graduated: 'bg-blue-100 text-blue-800',
    };
    return `px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`;
  };

  const getAssignmentStatusBadge = (status: Student['assignmentStatus']) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      complete: 'bg-green-100 text-green-800',
    };
    return `px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading students...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-2">Manage student enrollments and track their progress</p>
        </div>
        <Button onClick={() => openModal()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Student
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

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="graduated">Graduated</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">All Students</h2>
            <span className="text-sm text-gray-500">{filteredStudents.length} students found</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Courses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Paid
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr 
                    key={student.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => openViewModal(student)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">ID: {student.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{student.email}</div>
                        <div className="text-sm text-gray-500">{student.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.location}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {student.courses.slice(0, 2).map((course, index) => (
                          <span
                            key={`${student.id}-course-${index}`}
                            className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
                          >
                            {course}
                          </span>
                        ))}
                        {student.courses.length > 2 && (
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                            +{student.courses.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(student.status)}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${student.totalPaid}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal(student);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteStudent(student.id);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Student Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingStudent ? 'Edit Student' : 'Add New Student'}
      >
        <StudentAdmissionForm
          onSubmit={editingStudent ? handleEditStudent : handleAddStudent}
          onCancel={closeModal}
          initialData={editingStudent}
        />
      </Modal>

      {/* View Student Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={closeViewModal}
        title="Student Details"
      >
        {viewingStudent && (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Full Name</label>
                  <p className="text-sm text-gray-900">{viewingStudent.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-sm text-gray-900 flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    {viewingStudent.email}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-sm text-gray-900 flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    {viewingStudent.phone}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Gender</label>
                  <p className="text-sm text-gray-900">{viewingStudent.gender}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <span className={getStatusBadge(viewingStudent.status)}>
                    {viewingStudent.status}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Enrollment Date</label>
                  <p className="text-sm text-gray-900 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(viewingStudent.enrollmentDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Address Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Address</label>
                  <p className="text-sm text-gray-900">{viewingStudent.address}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">City</label>
                  <p className="text-sm text-gray-900">{viewingStudent.city}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Postcode</label>
                  <p className="text-sm text-gray-900">{viewingStudent.postcode}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Location</label>
                  <p className="text-sm text-gray-900">{viewingStudent.location}</p>
                </div>
              </div>
            </div>

            {/* Course Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Course Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Batch Number</label>
                  <p className="text-sm text-gray-900">{viewingStudent.batchNo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Course Type</label>
                  <p className="text-sm text-gray-900">{viewingStudent.courseType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Admission Type</label>
                  <p className="text-sm text-gray-900">{viewingStudent.admissionType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Vendor</label>
                  <p className="text-sm text-gray-900">{viewingStudent.vendor}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-600">Enrolled Courses</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {viewingStudent.courses.map((course, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Assignment Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Assignment Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Assignment Status</label>
                  <span className={getAssignmentStatusBadge(viewingStudent.assignmentStatus)}>
                    {viewingStudent.assignmentStatus}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Assignment Date</label>
                  <p className="text-sm text-gray-900 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(viewingStudent.assignmentDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Financial Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Course Fee</label>
                  <p className="text-sm text-gray-900">${viewingStudent.courseFee}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Discount</label>
                  <p className="text-sm text-gray-900">${viewingStudent.discount}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Total Paid</label>
                  <p className="text-sm text-gray-900">${viewingStudent.totalPaid}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Received</label>
                  <p className="text-sm text-gray-900">${viewingStudent.received}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Refund</label>
                  <p className="text-sm text-gray-900">${viewingStudent.refund}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Balance Due</label>
                  <p className="text-sm text-gray-900 font-semibold">${viewingStudent.balanceDue}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Payment Slots</label>
                  <p className="text-sm text-gray-900">{viewingStudent.paymentSlots}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Booked By</label>
                  <p className="text-sm text-gray-900">{viewingStudent.bookedBy || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            {viewingStudent.note && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h3>
                <p className="text-sm text-gray-900">{viewingStudent.note}</p>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button variant="outline" onClick={closeViewModal}>
                Close
              </Button>
              <Button 
                onClick={() => {
                  closeViewModal();
                  openModal(viewingStudent);
                }}
              >
                Edit Student
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}