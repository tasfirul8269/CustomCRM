import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Mail, Phone, MapPin, Calendar, User, Building, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import EmployeeForm from '../components/forms/EmployeeForm';
import { Employee } from '../types/employee';
import api from '../services/api';

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch employees from API
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await api.get('/employees');
      setEmployees(response.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddEmployee = async (employeeData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsSubmitting(true);
      setMessage('');
      setError('');
      await api.post('/employees', employeeData);
      setMessage('Employee added successfully!');
      fetchEmployees(); // Refresh the list
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditEmployee = async (employeeData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsSubmitting(true);
      setMessage('');
      setError('');
      if (editingEmployee) {
        const employeeId = editingEmployee.id || (editingEmployee as any)._id;
        await api.patch(`/employees/${employeeId}`, employeeData);
        setMessage('Employee updated successfully!');
        fetchEmployees(); // Refresh the list
        setIsModalOpen(false);
        setEditingEmployee(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      try {
        setMessage('');
        setError('');
        await api.delete(`/employees/${id}`);
        setMessage('Employee deleted successfully!');
        fetchEmployees(); // Refresh the list
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete employee');
      }
    }
  };

  const openModal = (employee?: Employee) => {
    if (employee) {
      setEditingEmployee(employee);
    } else {
      setEditingEmployee(null);
    }
    setIsModalOpen(true);
    setMessage('');
    setError('');
  };

  const openViewModal = (employee: Employee) => {
    setViewingEmployee(employee);
    setIsViewModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
    setMessage('');
    setError('');
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setViewingEmployee(null);
  };

  // Filter employees by search term
  const filteredEmployees = employees.filter(emp =>
    emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: Employee['status']) => {
    const styles = {
      Live: 'bg-green-100 text-green-800',
      Inactive: 'bg-red-100 text-red-800',
    };
    return `px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading employees...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-600 mt-1">Manage your organization's employees</p>
        </div>
        <Button
          onClick={() => openModal()}
          variant="primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md mb-2">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search employees by name, email, or position..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        />
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

      {/* Employees List */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Records</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredEmployees.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true">
                <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No employees</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding a new employee.
              </p>
              <div className="mt-6">
                <Button
                  onClick={() => openModal()}
                  variant="primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Employee
                </Button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Photo
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.map((employee, index) => (
                    <tr 
                      key={employee.id || (employee as any)._id || `employee-${index}`}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => openViewModal(employee)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                          {employee.photo ? (
                            <img 
                              src={employee.photo} 
                              alt={employee.fullName} 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-gray-400">
                              {employee.fullName.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {employee.fullName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.position}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(employee.status)}>
                          {employee.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal(employee);
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          <Edit className="h-4 w-4 inline" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEmployee(employee.id || (employee as any)._id);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingEmployee ? 'Edit Employee' : 'Add New Employee'}
      >
              <EmployeeForm
          onSubmit={editingEmployee ? handleEditEmployee : handleAddEmployee}
          onCancel={closeModal}
          isLoading={isSubmitting}
          initialData={editingEmployee || undefined}
              />
      </Modal>

      {/* View Employee Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={closeViewModal}
        title="Employee Details"
      >
        {viewingEmployee && (
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
                  <p className="text-sm text-gray-900">{viewingEmployee.fullName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-sm text-gray-900 flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    {viewingEmployee.email}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Mobile Number</label>
                  <p className="text-sm text-gray-900 flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    {viewingEmployee.mobileNumber}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Contact Number</label>
                  <p className="text-sm text-gray-900 flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    {viewingEmployee.contactNumber || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Position</label>
                  <p className="text-sm text-gray-900 flex items-center">
                    <Building className="h-4 w-4 mr-1" />
                    {viewingEmployee.position}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <span className={getStatusBadge(viewingEmployee.status)}>
                    {viewingEmployee.status}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Gender</label>
                  <p className="text-sm text-gray-900">{viewingEmployee.gender}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                  <p className="text-sm text-gray-900 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(viewingEmployee.dateOfBirth).toLocaleDateString()}
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
                  <label className="text-sm font-medium text-gray-600">Address Line 1</label>
                  <p className="text-sm text-gray-900">{viewingEmployee.addressLine1}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Address Line 2</label>
                  <p className="text-sm text-gray-900">{viewingEmployee.addressLine2 || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Employment Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Employment Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">License Number</label>
                  <p className="text-sm text-gray-900 flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    {viewingEmployee.licenseNumber}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Joining Date</label>
                  <p className="text-sm text-gray-900 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(viewingEmployee.joiningDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Leaving Date</label>
                  <p className="text-sm text-gray-900 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {viewingEmployee.leavingDate ? new Date(viewingEmployee.leavingDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Employee Vendor</label>
                  <p className="text-sm text-gray-900">{viewingEmployee.employeeVendor || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Notes */}
            {viewingEmployee.note && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                <p className="text-sm text-gray-900">{viewingEmployee.note}</p>
              </div>
            )}

            {/* Registration Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Registration Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Created On</label>
                  <p className="text-sm text-gray-900 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(viewingEmployee.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Last Updated</label>
                  <p className="text-sm text-gray-900 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(viewingEmployee.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button variant="outline" onClick={closeViewModal}>
                Close
              </Button>
              <Button 
                onClick={() => {
                  closeViewModal();
                  openModal(viewingEmployee);
                }}
              >
                Edit Employee
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}