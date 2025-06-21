import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Plus, Search, Filter, Edit, Trash2, Calendar, Users, Clock } from 'lucide-react';
import BatchForm from '../components/forms/BatchForm';
import { Batch } from '../types/batch';
import api from '../services/api';

export default function Batches() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch batches from API
  const fetchBatches = async () => {
    try {
      setLoading(true);
      const response = await api.get('/batches');
      console.log('Fetched batches:', response.data);
      setBatches(response.data);
    } catch (err) {
      console.error('Error fetching batches:', err);
      setError('Failed to fetch batches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const filteredBatches = batches.filter(batch => 
    batch.batchNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.subjectCourse.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddBatch = async (batchData: any) => {
    try {
      setMessage('');
      setError('');
      // Map form data to backend expected format
      const mappedData = {
        batchNo: batchData.batchNo,
        subjectCourse: batchData.subjectCourse,
        startingDate: batchData.startingDate,
        endingDate: batchData.endingDate,
        publishedStatus: batchData.publishedStatus,
        status: 'upcoming' // Default status for new batches
      };
      await api.post('/batches', mappedData);
      setMessage('Batch added successfully!');
      fetchBatches(); // Refresh the list
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add batch');
    }
  };

  const handleEditBatch = async (batchData: any) => {
    try {
      setMessage('');
      setError('');
      const batchId = editingBatch?.id || (editingBatch as any)?._id;
      if (editingBatch && batchId) {
        console.log('Editing batch:', editingBatch);
        console.log('Batch data:', batchData);
        // Map form data to backend expected format
        const mappedData = {
          batchNo: batchData.batchNo,
          subjectCourse: batchData.subjectCourse,
          startingDate: batchData.startingDate,
          endingDate: batchData.endingDate,
          publishedStatus: batchData.publishedStatus,
          status: editingBatch.status // Preserve the existing status
        };
        await api.patch(`/batches/${batchId}`, mappedData);
        setMessage('Batch updated successfully!');
        fetchBatches(); // Refresh the list
        setIsModalOpen(false);
        setEditingBatch(null);
      } else {
        setError('No batch selected for editing');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update batch');
    }
  };

  const handleDeleteBatch = async (id: string) => {
    if (confirm('Are you sure you want to delete this batch?')) {
      try {
        setMessage('');
        setError('');
        await api.delete(`/batches/${id}`);
        setMessage('Batch deleted successfully!');
        fetchBatches(); // Refresh the list
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete batch');
      }
    }
  };

  const openModal = (batch?: Batch) => {
    if (batch) {
      setEditingBatch(batch);
    } else {
      setEditingBatch(null);
    }
    setIsModalOpen(true);
    setMessage('');
    setError('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBatch(null);
    setMessage('');
    setError('');
  };

  const getStatusBadge = (status: Batch['status']) => {
    const styles = {
      upcoming: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
    };
    return `px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading batches...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Batches</h1>
          <p className="text-gray-600 mt-2">Manage your training batches and schedules</p>
        </div>
        <Button onClick={() => openModal()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Batch
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
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search batches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>
            <div className="flex space-x-2">
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                <option>All Status</option>
                <option>Upcoming</option>
                <option>Active</option>
                <option>Completed</option>
              </select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBatches.map((batch, index) => (
          <Card key={batch.id || (batch as any)._id || `batch-${index}`} className="overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{batch.batchNo}</h3>
                  <p className="text-sm text-gray-500 mt-1">{batch.subjectCourse}</p>
                </div>
              </div>
              
              <div className="mt-4 space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{new Date(batch.startingDate).toLocaleDateString()} - {new Date(batch.endingDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{batch.publishedStatus ? 'Published' : 'Draft'}</span>
                </div>
              </div>

              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => openModal(batch)}
                  className="text-blue-600 hover:text-blue-900"
                >
                    <Edit className="h-4 w-4" />
                  </button>
                <button
                  onClick={() => handleDeleteBatch(batch.id)}
                  className="text-red-600 hover:text-red-900"
                >
                    <Trash2 className="h-4 w-4" />
                  </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingBatch ? 'Edit Batch' : 'Add New Batch'}
      >
              <BatchForm 
          onSubmit={editingBatch ? handleEditBatch : handleAddBatch}
          onCancel={closeModal}
          initialData={editingBatch}
              />
      </Modal>
    </div>
  );
}
