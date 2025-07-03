import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Search, Filter, Plus, Mail, Printer, MoreVertical, Check, X, Edit, Trash2 } from 'lucide-react';
import Modal from '../components/ui/Modal';
import CertificateForm from '../components/forms/CertificateForm';
import { Certificate } from '../types/certificate';
import api from '../services/api';

export default function Certifications() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All Status');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch certificates from API
  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const response = await api.get('/certificates');
      setCertificates(response.data);
    } catch (err) {
      console.error('Error fetching certificates:', err);
      setError('Failed to fetch certificates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const filteredCertificates = certificates.filter(cert => {
    // Search filter
    const searchMatch =
      (typeof cert.student === 'object' && cert.student && cert.student.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      cert.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (typeof cert.course === 'object' && cert.course && cert.course.title.toLowerCase().includes(searchTerm.toLowerCase()));

    // Status filter
    const statusMatch = 
      statusFilter === 'All Status' ||
      cert.status === statusFilter.toLowerCase();

    return searchMatch && statusMatch;
  });

  const handleAddCertificate = async (certificateData: any) => {
    try {
      setMessage('');
      setError('');
      await api.post('/certificates', certificateData);
      setMessage('Certificate added successfully!');
      fetchCertificates(); // Refresh the list
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add certificate');
    }
  };

  const handleEditCertificate = async (certificateData: any) => {
    try {
      setMessage('');
      setError('');
      if (editingCertificate) {
        const certificateId = editingCertificate._id;
        await api.patch(`/certificates/${certificateId}`, certificateData);
        setMessage('Certificate updated successfully!');
        fetchCertificates(); // Refresh the list
        setIsModalOpen(false);
        setEditingCertificate(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update certificate');
    }
  };

  const handleDeleteCertificate = async (id: string) => {
    if (confirm('Are you sure you want to delete this certificate?')) {
      try {
        setMessage('');
        setError('');
        await api.delete(`/certificates/${id}`);
        setMessage('Certificate deleted successfully!');
        fetchCertificates(); // Refresh the list
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete certificate');
      }
    }
  };

  const openModal = (certificate?: Certificate) => {
    if (certificate) {
      setEditingCertificate(certificate);
    } else {
      setEditingCertificate(null);
    }
    setIsModalOpen(true);
    setMessage('');
    setError('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCertificate(null);
    setMessage('');
    setError('');
  };

  const getStatusBadge = (status: Certificate['status']) => {
    const styles = {
      issued: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      dispatched: 'bg-purple-100 text-purple-800',
    };
    return `px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading certificates...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Certification Dispatch</h1>
          <p className="text-gray-600 mt-1">Manage and track certificate issuance and delivery</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={() => openModal()}>
            <Plus className="h-4 w-4 mr-2" />
            Issue Certificate
          </Button>
        </div>
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search certificates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <select 
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>All Status</option>
                <option>Pending</option>
                <option>Issued</option>
                <option>Dispatched</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certificates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Certificate Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Certificate No.
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issue Date
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
                {filteredCertificates.map((cert) => (
                  <tr key={cert._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {cert.certificateNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {typeof cert.student === 'object' && cert.student ? cert.student.name : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {typeof cert.course === 'object' && cert.course ? cert.course.title : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(cert.issueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(cert.status)}>
                        {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => openModal(cert)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteCertificate(cert._id)}
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

      {/* Add Certificate Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingCertificate ? 'Edit Certificate' : 'Certificate Dispatch Record'}
      >
        <CertificateForm 
          onSubmit={editingCertificate ? handleEditCertificate : handleAddCertificate}
          onCancel={closeModal}
          initialData={editingCertificate || undefined}
        />
      </Modal>
    </div>
  );
}
