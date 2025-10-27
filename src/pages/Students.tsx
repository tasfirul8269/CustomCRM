import React, { useState, useEffect, useContext } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import StudentAdmissionForm from '../components/forms/StudentAdmissionForm';
import { Student } from '../types';
import { Plus, Search, Eye, Edit, Trash2, Calendar, MapPin, Phone, Mail, PoundSterling, User, BookOpen, FileText, CreditCard, Square } from 'lucide-react';
import api from '../services/api';
import { Batch } from '../types/batch';
import Select from 'react-select';
import { AuthContext } from '../context/AuthContext';

export default function Students() {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }
  const { hasPermission } = authContext;

  const [students, setStudents] = useState<Student[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [specialFilter, setSpecialFilter] = useState('all'); // 'all', 'resit', 'microtech'
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resitModalOpen, setResitModalOpen] = useState(false);
  const [resitStudent, setResitStudent] = useState<Student | null>(null);
  const [resitBatch, setResitBatch] = useState('');
  const [resitStatus, setResitStatus] = useState('yes');
  const [batchOptions, setBatchOptions] = useState<Batch[]>([]);
  const [batchSearch, setBatchSearch] = useState('');
  const [loadingBatches, setLoadingBatches] = useState(false);
  const [microtechModalOpen, setMicrotechModalOpen] = useState(false);
  const [microtechStudent, setMicrotechStudent] = useState<Student | null>(null);
  const [microtechBatch, setMicrotechBatch] = useState('');
  const [microtechStatus, setMicrotechStatus] = useState('yes');

  // Fetch students from API
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/students');
      // Map _id to id for each student
      const studentsWithId = response.data.map((s: any) => ({
        ...s,
        id: s._id,
        bookedBy: s.bookedBy?._id || s.bookedBy || '',
        paymentPlan: Array.isArray(s.paymentPlan) ? s.paymentPlan : [],
      }));
      console.log('Fetched students:', studentsWithId);
      setStudents(studentsWithId);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  // Fetch batches for resit modal
  const fetchBatches = async (search = '') => {
    setLoadingBatches(true);
    const response = await api.get('/batches');
    setBatchOptions(
      response.data.filter((b: Batch) =>
        b.batchNo.toLowerCase().includes(search.toLowerCase()) ||
        b.subjectCourse.toLowerCase().includes(search.toLowerCase())
      )
    );
    setLoadingBatches(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (resitModalOpen) fetchBatches(batchSearch);
  }, [resitModalOpen, batchSearch]);

  useEffect(() => {
    if (microtechModalOpen) fetchBatches(batchSearch);
  }, [microtechModalOpen, batchSearch]);

  // Inject resit bar style into the document head
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `.resit-bar::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 6px; background: #dc2626; border-radius: 3px 0 0 3px; }
    .resit-bar > .text-sm { padding-left: 17px; }
    .microtech-bar::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 6px; background: #2563eb; border-radius: 3px 0 0 3px; }
    .microtech-bar > .text-sm { padding-left: 17px; }`;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    let matchesSpecial = true;
    if (specialFilter === 'resit') {
      matchesSpecial = !!(student.resit && student.resit.status === 'yes');
    } else if (specialFilter === 'microtech') {
      matchesSpecial = !!(student.microtech && student.microtech.status === 'yes');
    }
    return matchesSearch && matchesStatus && matchesSpecial;
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

  const openResitModal = (student: Student) => {
    setResitStudent(student);
    setResitBatch(student.resit?.batch || '');
    setResitStatus(student.resit?.status || 'yes');
    setResitModalOpen(true);
  };

  const closeResitModal = () => {
    setResitModalOpen(false);
    setResitStudent(null);
    setResitBatch('');
    setResitStatus('yes');
    setBatchSearch('');
  };

  const handleResitSubmit = async () => {
    if (!resitStudent) return;
    console.log('PATCH /students/:id payload:', { resit: { batch: resitBatch, status: resitStatus } });
    await api.patch(`/students/${resitStudent.id}`, { resit: { batch: resitBatch, status: resitStatus } })
      .then((res: any) => console.log('PATCH /students/:id response:', res.data))
      .catch((err: any) => console.error('PATCH /students/:id error:', err));
    fetchStudents();
    closeResitModal();
  };

  const openMicrotechModal = (student: Student) => {
    setMicrotechStudent(student);
    setMicrotechBatch(student.microtech?.batch || '');
    setMicrotechStatus(student.microtech?.status || 'yes');
    setMicrotechModalOpen(true);
  };

  const closeMicrotechModal = () => {
    setMicrotechModalOpen(false);
    setMicrotechStudent(null);
    setMicrotechBatch('');
    setMicrotechStatus('yes');
    setBatchSearch('');
  };

  const handleMicrotechSubmit = async () => {
    if (!microtechStudent) return;
    await api.patch(`/students/${microtechStudent.id}`, { microtech: { batch: microtechBatch, status: microtechStatus } })
      .then((res: any) => console.log('PATCH /students/:id response:', res.data))
      .catch((err: any) => console.error('PATCH /students/:id error:', err));
    fetchStudents();
    closeMicrotechModal();
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
        {hasPermission('students', 'write') && (
          <Button onClick={() => openModal()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        )}
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
              <select
                value={specialFilter}
                onChange={e => setSpecialFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="resit">Resit</option>
                <option value="microtech">Micro Tech</option>
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
                    Batch
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
                    className={"hover:bg-gray-50 cursor-pointer relative"}
                    onClick={() => openViewModal(student)}
                  >
                    <td className={`py-4 whitespace-nowrap ${
                      student.resit && student.resit.status === 'yes'
                        ? 'pl-2'
                        : student.microtech && student.microtech.status === 'yes'
                        ? 'pl-2'
                        : 'px-6'
                    }`}>
                      <div className={`relative${
                        student.resit && student.resit.status === 'yes' && student.microtech && student.microtech.status === 'yes'
                          ? ' resit-bar microtech-bar'
                          : student.resit && student.resit.status === 'yes'
                          ? ' resit-bar'
                          : student.microtech && student.microtech.status === 'yes'
                          ? ' microtech-bar'
                          : ''
                      }`}>
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.batchNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(student.status)}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      £{student.totalPaid}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex items-center justify-center space-x-2">
                        {hasPermission('students', 'write') && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openResitModal(student);
                              }}
                              className="bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-full w-7 h-7 flex items-center justify-center font-bold text-xs border border-purple-300"
                              title="Resit"
                            >
                              R
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openMicrotechModal(student);
                              }}
                              className="bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-full w-7 h-7 flex items-center justify-center font-bold text-xs border border-blue-300"
                              title="Micro Tech"
                            >
                              M
                            </button>
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
                          </>
                        )}
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
        className="max-w-3xl"
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Admission Date</label>
                  <p className="text-sm text-gray-900 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {viewingStudent.enrollmentDate ? new Date(viewingStudent.enrollmentDate).toLocaleDateString() : ''}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Student Name</label>
                  <p className="text-sm text-gray-900">{viewingStudent.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Contact Number</label>
                  <p className="text-sm text-gray-900">{viewingStudent.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email ID</label>
                  <p className="text-sm text-gray-900">{viewingStudent.email}</p>
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
              </div>
            </div>

            {/* Course & Batch Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Course & Batch Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Batch No</label>
                  <p className="text-sm text-gray-900">{viewingStudent.batchNo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Vendor</label>
                  <p className="text-sm text-gray-900">{viewingStudent.vendor}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Location</label>
                  <p className="text-sm text-gray-900">{viewingStudent.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Booked By</label>
                  <p className="text-sm text-gray-900">
                    {(() => {
                      const b = viewingStudent.bookedBy as any;
                      if (!b) return 'N/A';
                      if (typeof b === 'object') {
                        const name = b.name || '';
                        const email = b.email ? `(${b.email})` : '';
                        return (name + ' ' + email).trim() || 'N/A';
                      }
                      return b;
                    })()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Course Type</label>
                  <p className="text-sm text-gray-900">{viewingStudent.courseType}</p>
                </div>
              </div>
            </div>

            {/* Assignment Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Assignment Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    {viewingStudent.assignmentDate ? new Date(viewingStudent.assignmentDate).toLocaleDateString() : ''}
                  </p>
                </div>
                <div className="md:col-span-3">
                  <label className="text-sm font-medium text-gray-600">Note</label>
                  <p className="text-sm text-gray-900">{viewingStudent.note}</p>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <PoundSterling className="h-5 w-5 mr-2" />
                Payment Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Admission Type</label>
                  <p className="text-sm text-gray-900">{viewingStudent.admissionType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Payment Slots</label>
                  <p className="text-sm text-gray-900">{viewingStudent.paymentSlots}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Course Fee</label>
                  <p className="text-sm text-gray-900">{viewingStudent.courseFee}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Discount</label>
                  <p className="text-sm text-gray-900">{viewingStudent.discount}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Total Paid</label>
                  <p className="text-sm text-gray-900">£{viewingStudent.totalPaid}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Received</label>
                  <p className="text-sm text-gray-900">{viewingStudent.received}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Refund</label>
                  <p className="text-sm text-gray-900">{viewingStudent.refund}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Balance Due</label>
                  <p className="text-sm text-gray-900 font-semibold">£{viewingStudent.balanceDue}</p>
                </div>
              </div>
            </div>

            {/* Payment Plan Information */}
            {viewingStudent.admissionType === 'price-plan' && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Plan
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 rounded-lg">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">#</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Amount</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Received</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(Array.isArray(viewingStudent.paymentPlan) && viewingStudent.paymentPlan.length > 0
                        ? viewingStudent.paymentPlan
                        : Array.from({ length: parseInt(viewingStudent.paymentSlots) || 1 }, () => ({ date: '', amount: 0, received: 0 }))
                      ).map((row, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-2">{idx + 1}</td>
                          <td className="px-4 py-2">{row.date ? new Date(row.date).toLocaleDateString() : ''}</td>
                          <td className="px-4 py-2">{row.amount}</td>
                          <td className="px-4 py-2">{row.received}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Resit/Retake Information */}
            {viewingStudent.resit && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                  <Square className="h-5 w-5 mr-2 text-purple-600" />
                  Resit (Retake) Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Batch</label>
                    <p className="text-sm text-gray-900">{viewingStudent.resit.batch}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <p className="text-sm text-gray-900">{viewingStudent.resit.status === 'yes' ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Micro Tech Information */}
            {viewingStudent.microtech && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                  <Square className="h-5 w-5 mr-2 text-blue-600" />
                  Micro Tech Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Batch</label>
                    <p className="text-sm text-gray-900">{viewingStudent.microtech.batch}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <p className="text-sm text-gray-900">{viewingStudent.microtech.status === 'yes' ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button variant="outline" onClick={closeViewModal}>
                Close
              </Button>
              {hasPermission('students', 'write') && (
                <Button 
                  onClick={() => {
                    closeViewModal();
                    openModal(viewingStudent);
                  }}
                >
                  Edit Student
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Resit Modal */}
      <Modal
        isOpen={resitModalOpen}
        onClose={closeResitModal}
        title="Resit (Retake)"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
            <Select
              value={batchOptions.find(b => b.batchNo === resitBatch) ? { value: resitBatch, label: `${batchOptions.find(b => b.batchNo === resitBatch)?.batchNo} : ${new Date(batchOptions.find(b => b.batchNo === resitBatch)?.startingDate || '').toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' })} - ${new Date(batchOptions.find(b => b.batchNo === resitBatch)?.endingDate || '').toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' })}` } : null}
              onChange={option => setResitBatch(option ? option.value : '')}
              options={batchOptions.map(batch => ({
                value: batch.batchNo,
                label: `${batch.batchNo} : ${new Date(batch.startingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' })} - ${new Date(batch.endingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' })}`
              }))}
              isClearable
              isSearchable
              placeholder="Select batch..."
              isLoading={loadingBatches}
              classNamePrefix="react-select"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={resitStatus}
              onChange={e => setResitStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="outline" onClick={closeResitModal}>Cancel</Button>
            <Button onClick={handleResitSubmit} disabled={!resitBatch}>Save</Button>
          </div>
        </div>
      </Modal>

      {/* Micro Tech Modal */}
      <Modal
        isOpen={microtechModalOpen}
        onClose={closeMicrotechModal}
        title="Micro Tech"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
            <Select
              value={batchOptions.find(b => b.batchNo === microtechBatch) ? { value: microtechBatch, label: `${batchOptions.find(b => b.batchNo === microtechBatch)?.batchNo} : ${new Date(batchOptions.find(b => b.batchNo === microtechBatch)?.startingDate || '').toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' })} - ${new Date(batchOptions.find(b => b.batchNo === microtechBatch)?.endingDate || '').toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' })}` } : null}
              onChange={option => setMicrotechBatch(option ? option.value : '')}
              options={batchOptions.map(batch => ({
                value: batch.batchNo,
                label: `${batch.batchNo} : ${new Date(batch.startingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' })} - ${new Date(batch.endingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' })}`
              }))}
              isClearable
              isSearchable
              placeholder="Select batch..."
              isLoading={loadingBatches}
              classNamePrefix="react-select"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={microtechStatus}
              onChange={e => setMicrotechStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="outline" onClick={closeMicrotechModal}>Cancel</Button>
            <Button onClick={handleMicrotechSubmit} disabled={!microtechBatch}>Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}