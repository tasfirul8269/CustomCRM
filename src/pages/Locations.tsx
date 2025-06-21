import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import LocationForm from '../components/forms/LocationForm';
import { Location } from '../types';
import { Plus, Search, MapPin, Settings, Eye, Edit, Trash2 } from 'lucide-react';
import api from '../services/api';

export default function Locations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch locations from API
  const fetchLocations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/locations');
      setLocations(response.data);
    } catch (err) {
      console.error('Error fetching locations:', err);
      setError('Failed to fetch locations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const filteredLocations = locations.filter(location =>
    (location.locationName?.toLowerCase() || location.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (location.addressLine1?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleAddLocation = async (locationData: any) => {
    try {
      setMessage('');
      setError('');
      await api.post('/locations', locationData);
      setMessage('Location added successfully!');
      fetchLocations(); // Refresh the list
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add location');
    }
  };

  const handleEditLocation = async (locationData: any) => {
    try {
      setMessage('');
      setError('');
      if (editingLocation) {
        await api.patch(`/locations/${editingLocation.id}`, locationData);
        setMessage('Location updated successfully!');
        fetchLocations(); // Refresh the list
    setIsModalOpen(false);
        setEditingLocation(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update location');
    }
  };

  const handleDeleteLocation = async (id: string) => {
    if (confirm('Are you sure you want to delete this location?')) {
      try {
        setMessage('');
        setError('');
        await api.delete(`/locations/${id}`);
        setMessage('Location deleted successfully!');
        fetchLocations(); // Refresh the list
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete location');
      }
    }
  };

  const openModal = (location?: Location) => {
    if (location) {
      setEditingLocation(location);
    } else {
      setEditingLocation(null);
    }
    setIsModalOpen(true);
    setMessage('');
    setError('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLocation(null);
    setMessage('');
    setError('');
  };

  const getPublishBadge = (publishStatus: Location['publishStatus']) => {
    const styles = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-gray-100 text-gray-800',
    };
    return `px-2 py-1 text-xs font-medium rounded-full ${styles[publishStatus]}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading locations...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Locations</h1>
          <p className="text-gray-600 mt-2">Manage training centers and their facilities</p>
        </div>
        <Button onClick={() => openModal()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Location
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
                <p className="text-sm font-medium text-gray-600">Total Locations</p>
                <p className="text-3xl font-bold text-gray-900">{locations.length}</p>
              </div>
              <div className="p-3 bg-blue-500 rounded-full">
                <MapPin className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-3xl font-bold text-gray-900">
                  {locations.filter(l => l.publishStatus === 'published').length}
                </p>
              </div>
              <div className="p-3 bg-green-500 rounded-full">
                <Eye className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Locations Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Publish Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
        {filteredLocations.map((location) => (
                  <tr key={location.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{location.locationName || location.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {location.addressLine1}
                        {location.addressLine2 && (
                          <div className="text-sm text-gray-500">{location.addressLine2}</div>
                        )}
                  </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                  <span className={getPublishBadge(location.publishStatus)}>
                        {location.publishStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openModal(location)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                      <Edit className="h-4 w-4" />
                    </button>
                        <button
                          onClick={() => handleDeleteLocation(location.id)}
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

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingLocation ? 'Edit Location' : 'Add New Location'}
      >
        <LocationForm
          onSubmit={editingLocation ? handleEditLocation : handleAddLocation}
          onCancel={closeModal}
          initialData={editingLocation}
        />
      </Modal>
    </div>
  );
}