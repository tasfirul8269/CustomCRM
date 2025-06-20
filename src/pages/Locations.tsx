import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import LocationForm from '../components/forms/LocationForm';
import { Location } from '../types';
import { Plus, Search, MapPin, Users, Settings, Eye, Edit, Trash2 } from 'lucide-react';

export default function Locations() {
  const [locations, setLocations] = useState<Location[]>([
    {
      id: '1',
      name: 'Manhattan Training Center',
      address: '123 Broadway Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      capacity: 150,
      facilities: ['WiFi', 'Projector', 'Air Conditioning', 'Parking'],
      status: 'active',
      addressLine1: '123 Broadway Street',
      addressLine2: 'Suite 500',
      publishStatus: 'published',
    },
    {
      id: '2',
      name: 'Downtown Learning Hub',
      address: '456 Main Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      capacity: 200,
      facilities: ['WiFi', 'Projector', 'Cafeteria', 'Library', 'Parking'],
      status: 'active',
      addressLine1: '456 Main Avenue',
      addressLine2: 'Floor 3',
      publishStatus: 'published',
    },
    {
      id: '3',
      name: 'Chicago Tech Campus',
      address: '789 Lake Shore Drive',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      capacity: 100,
      facilities: ['WiFi', 'Lab Equipment', 'Air Conditioning'],
      status: 'inactive',
      addressLine1: '789 Lake Shore Drive',
      addressLine2: '',
      publishStatus: 'draft',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddLocation = (locationData: any) => {
    const newLocation: Location = {
      id: Date.now().toString(),
      name: locationData.locationName,
      address: locationData.addressLine1,
      city: 'Unknown', // You might want to add city field to the form
      state: 'Unknown', // You might want to add state field to the form
      zipCode: 'Unknown', // You might want to add zipCode field to the form
      capacity: 0, // You might want to add capacity field to the form
      facilities: [], // You might want to add facilities field to the form
      status: locationData.publishStatus === 'published' ? 'active' : 'inactive',
      addressLine1: locationData.addressLine1,
      addressLine2: locationData.addressLine2,
      publishStatus: locationData.publishStatus,
    };
    setLocations(prev => [...prev, newLocation]);
    setIsModalOpen(false);
  };

  const getStatusBadge = (status: Location['status']) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
    };
    return `px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`;
  };

  const getPublishBadge = (publishStatus: Location['publishStatus']) => {
    const styles = {
      published: 'bg-blue-100 text-blue-800',
      draft: 'bg-gray-100 text-gray-800',
    };
    return `px-2 py-1 text-xs font-medium rounded-full ${styles[publishStatus]}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Locations</h1>
          <p className="text-gray-600 mt-2">Manage training centers and their facilities</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Location
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                <p className="text-sm font-medium text-gray-600">Active Locations</p>
                <p className="text-3xl font-bold text-gray-900">
                  {locations.filter(l => l.status === 'active').length}
                </p>
              </div>
              <div className="p-3 bg-green-500 rounded-full">
                <Settings className="h-6 w-6 text-white" />
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
              <div className="p-3 bg-purple-500 rounded-full">
                <Eye className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Capacity</p>
                <p className="text-3xl font-bold text-gray-900">
                  {locations.reduce((sum, location) => sum + location.capacity, 0)}
                </p>
              </div>
              <div className="p-3 bg-yellow-500 rounded-full">
                <Users className="h-6 w-6 text-white" />
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

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLocations.map((location) => (
          <Card key={location.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{location.name}</h3>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {location.city}, {location.state}
                  </div>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className={getStatusBadge(location.status)}>
                    {location.status.charAt(0).toUpperCase() + location.status.slice(1)}
                  </span>
                  <span className={getPublishBadge(location.publishStatus)}>
                    {location.publishStatus.charAt(0).toUpperCase() + location.publishStatus.slice(1)}
                  </span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  <div>{location.addressLine1}</div>
                  {location.addressLine2 && <div>{location.addressLine2}</div>}
                  <div>{location.city}, {location.state} {location.zipCode}</div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-1" />
                    Capacity
                  </span>
                  <span className="font-semibold text-gray-900">{location.capacity} students</span>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Facilities:</p>
                  <div className="flex flex-wrap gap-1">
                    {location.facilities.map((facility, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
                      >
                        {facility}
                      </span>
                    ))}
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

      {filteredLocations.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No locations found matching your criteria.</p>
          </CardContent>
        </Card>
      )}

      {/* Add Location Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Location"
        size="lg"
      >
        <LocationForm
          onSubmit={handleAddLocation}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}