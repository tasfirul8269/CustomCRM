import React, { useState, useEffect, useContext } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Plus, Search, Filter, Edit, Trash2, ChevronDown, Mail, Phone, MapPin, Building, Calendar, FileText, PoundSterling, User, Globe, CreditCard } from 'lucide-react';
import Modal from '../components/ui/Modal';
import VendorForm from '../components/forms/VendorForm';
import { Vendor } from '../types/vendor';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function Vendors() {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }
  const { hasPermission, user } = authContext;

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [viewingVendor, setViewingVendor] = useState<Vendor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [publishedFilter, setPublishedFilter] = useState<'all' | 'published' | 'unpublished'>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch vendors from API
  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/vendors');
      setVendors(response.data);
    } catch (err) {
      console.error('Error fetching vendors:', err);
      setError('Failed to fetch vendors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
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

  const filteredVendors = vendors.filter(vendor => {
    // Search filter
    const searchMatch = 
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vendor.company && vendor.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (vendor.registrationNumber && vendor.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (vendor.phone && vendor.phone.toLowerCase().includes(searchTerm.toLowerCase()));

    // Published filter
    const publishedMatch = 
      publishedFilter === 'all' ||
      (publishedFilter === 'published' && vendor.published) ||
      (publishedFilter === 'unpublished' && !vendor.published);

    return searchMatch && publishedMatch;
  });

  const handleAddVendor = async (vendorData: any) => {
    try {
      setMessage('');
      setError('');
      // Map vendorName to name for backend compatibility
      const dataToSend = { ...vendorData };
      dataToSend.name = vendorData.vendorName;
      delete dataToSend.vendorName;
      if (dataToSend.logo instanceof File) {
        dataToSend.logo = '';
      }
      await api.post('/vendors', dataToSend);
      setMessage('Vendor added successfully!');
      fetchVendors(); // Refresh the list
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add vendor');
    }
  };

  const handleEditVendor = async (vendorData: any) => {
    try {
      setMessage('');
      setError('');
      if (editingVendor) {
        const vendorId = editingVendor.id || (editingVendor as any)._id;
        await api.patch(`/vendors/${vendorId}`, vendorData);
        setMessage('Vendor updated successfully!');
        fetchVendors(); // Refresh the list
        setIsModalOpen(false);
        setEditingVendor(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update vendor');
    }
  };

  const handleDeleteVendor = async (id: string) => {
    if (confirm('Are you sure you want to delete this vendor?')) {
      try {
        setMessage('');
        setError('');
        await api.delete(`/vendors/${id}`);
        setMessage('Vendor deleted successfully!');
        fetchVendors(); // Refresh the list
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete vendor');
      }
    }
  };

  const openModal = (vendor?: Vendor) => {
    if (vendor) {
      setEditingVendor(vendor);
    } else {
      setEditingVendor(null);
    }
    setIsModalOpen(true);
    setMessage('');
    setError('');
  };

  const openViewModal = (vendor: Vendor) => {
    setViewingVendor(vendor);
    setIsViewModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingVendor(null);
    setMessage('');
    setError('');
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setViewingVendor(null);
  };

  const getStatusBadge = (status: Vendor['status']) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
    };
    return `px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`;
  };

  const getPublishedBadge = (published: boolean) => {
    const styles = published 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-gray-100 text-gray-800';
    return `px-2 py-1 text-xs font-medium rounded-full ${styles}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading vendors...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendors</h1>
          <p className="text-gray-600 mt-2">Manage your vendors and their information</p>
        </div>
        {hasPermission('vendors', 'write') && (
          <Button onClick={() => openModal()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Vendor
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
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search vendors by name, email, company, registration number, or phone..."
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
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Published Status</h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="publishedFilter"
                          value="all"
                          checked={publishedFilter === 'all'}
                          onChange={(e) => setPublishedFilter(e.target.value as 'all' | 'published' | 'unpublished')}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">All Vendors</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="publishedFilter"
                          value="published"
                          checked={publishedFilter === 'published'}
                          onChange={(e) => setPublishedFilter(e.target.value as 'all' | 'published' | 'unpublished')}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Published Only</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="publishedFilter"
                          value="unpublished"
                          checked={publishedFilter === 'unpublished'}
                          onChange={(e) => setPublishedFilter(e.target.value as 'all' | 'published' | 'unpublished')}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Unpublished Only</span>
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
      {(searchTerm || publishedFilter !== 'all') && (
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Active filters:</span>
          {searchTerm && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
              Search: "{searchTerm}"
            </span>
          )}
          {publishedFilter !== 'all' && (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
              {publishedFilter === 'published' ? 'Published Only' : 'Unpublished Only'}
            </span>
          )}
          <button 
            onClick={() => {
              setSearchTerm('');
              setPublishedFilter('all');
            }}
            className="text-red-600 hover:text-red-800 underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Vendors Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Published
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registered On
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVendors.map((vendor, index) => (
                <tr 
                  key={vendor.id || (vendor as any)._id || `vendor-${index}`} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => openViewModal(vendor)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{vendor.name}</div>
                        <div className="text-sm text-gray-500">{vendor.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{vendor.company}</div>
                    <div className="text-sm text-gray-500">{vendor.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(vendor.status)}>
                      {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getPublishedBadge(vendor.published)}>
                      {vendor.published ? 'Published' : 'Unpublished'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(vendor.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {user?.role === 'admin' && (
                      <>
                        <button 
                          className="text-blue-600 hover:text-blue-900 mr-4" 
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal(vendor);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteVendor(vendor.id || (vendor as any)._id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Vendor Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingVendor ? 'Edit Vendor' : 'Add New Vendor'}
      >
              <VendorForm 
          onSubmit={editingVendor ? handleEditVendor : handleAddVendor}
          onCancel={closeModal}
          initialData={editingVendor || undefined}
              />
      </Modal>

      {/* View Vendor Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={closeViewModal}
        title="Vendor Details"
      >
        {viewingVendor && (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Vendor Name</label>
                  <p className="text-sm text-gray-900">{viewingVendor.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Company</label>
                  <p className="text-sm text-gray-900 flex items-center">
                    <Building className="h-4 w-4 mr-1" />
                    {viewingVendor.company}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-sm text-gray-900 flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    {viewingVendor.email}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-sm text-gray-900 flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    {viewingVendor.phone}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <span className={getStatusBadge(viewingVendor.status)}>
                    {viewingVendor.status.charAt(0).toUpperCase() + viewingVendor.status.slice(1)}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Published Status</label>
                  <span className={getPublishedBadge(viewingVendor.published)}>
                    {viewingVendor.published ? 'Published' : 'Unpublished'}
                  </span>
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
                  <p className="text-sm text-gray-900">{viewingVendor.addressLine1}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Address Line 2</label>
                  <p className="text-sm text-gray-900">{viewingVendor.addressLine2 || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Business Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Registration Number</label>
                  <p className="text-sm text-gray-900 flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    {viewingVendor.registrationNumber || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Invoice Prefix</label>
                  <p className="text-sm text-gray-900">{viewingVendor.invoicePrefix || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Contract Value</label>
                  <p className="text-sm text-gray-900 flex items-center">
                    <PoundSterling className="h-4 w-4 mr-1" />
                    £{viewingVendor.contractValue}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Web Address</label>
                  <p className="text-sm text-gray-900 flex items-center">
                    <Globe className="h-4 w-4 mr-1" />
                    {viewingVendor.webAddress || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Fax</label>
                  <p className="text-sm text-gray-900">{viewingVendor.fax || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Account Info</label>
                  <p className="text-sm text-gray-900 flex items-center">
                    <CreditCard className="h-4 w-4 mr-1" />
                    {viewingVendor.accountInfo || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Services */}
            {viewingVendor.services && viewingVendor.services.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Services Offered</h3>
                <div className="flex flex-wrap gap-2">
                  {viewingVendor.services.map((service, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Approval Information */}
            {viewingVendor.approvedBy && viewingVendor.approvedBy.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Approved By</h3>
                <div className="flex flex-wrap gap-2">
                  {viewingVendor.approvedBy.map((approver, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
                    >
                      {approver}
                    </span>
                  ))}
                </div>
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
                    {new Date(viewingVendor.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Last Updated</label>
                  <p className="text-sm text-gray-900 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(viewingVendor.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button variant="outline" onClick={closeViewModal}>
                Close
              </Button>
              {user?.role === 'admin' && (
                <Button 
                  onClick={() => {
                    closeViewModal();
                    openModal(viewingVendor);
                  }}
                >
                  Edit Vendor
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
