import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Plus, Search, Filter, Edit, Trash2, Check, X, ExternalLink } from 'lucide-react';
import VendorForm from '../components/forms/VendorForm';
import { Vendor } from '../types/vendor';

export default function Vendors() {
  const [vendors, setVendors] = useState<Vendor[]>([{
    id: '1',
    name: 'ABC Suppliers',
    email: 'contact@abcsuppliers.com',
    phone: '+1 234 567 8901',
    address: '123 Business St, New York, NY 10001',
    contactPerson: 'John Smith',
    status: 'active',
    registrationDate: '2023-01-15',
    website: 'https://abcsuppliers.com'
  }, {
    id: '2',
    name: 'XYZ Distributors',
    email: 'sales@xyzdist.com',
    phone: '+1 987 654 3210',
    address: '456 Commerce Ave, Los Angeles, CA 90001',
    contactPerson: 'Sarah Johnson',
    status: 'active',
    registrationDate: '2023-02-20'
  }]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddVendorForm, setShowAddVendorForm] = useState(false);

  const filteredVendors = vendors.filter(vendor => 
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddVendor = (data: any) => {
    // In a real app, you would make an API call here
    const newVendor: Vendor = {
      id: (vendors.length + 1).toString(),
      name: data.vendorName,
      email: data.email,
      phone: data.phone,
      address: `${data.addressLine1}${data.addressLine2 ? `, ${data.addressLine2}` : ''}`,
      contactPerson: data.contactPerson || 'N/A',
      status: data.published ? 'active' : 'inactive',
      registrationDate: new Date().toISOString().split('T')[0],
      website: data.webAddress || undefined
    };
    
    setVendors([...vendors, newVendor]);
    setShowAddVendorForm(false);
  };

  const getStatusBadge = (status: Vendor['status']) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
    };
    return `px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendors</h1>
          <p className="text-gray-600 mt-2">Manage your vendors and their information</p>
        </div>
        <Button onClick={() => setShowAddVendorForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Vendor
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

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
                  Registered On
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{vendor.name}</div>
                        <div className="text-sm text-gray-500">{vendor.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{vendor.contactPerson}</div>
                    <div className="text-sm text-gray-500">{vendor.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(vendor.status)}>
                      {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(vendor.registrationDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-4">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Vendor Form Modal */}
      {showAddVendorForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add New Vendor</h2>
                <button 
                  onClick={() => setShowAddVendorForm(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <VendorForm 
                onSubmit={handleAddVendor} 
                onCancel={() => setShowAddVendorForm(false)} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
