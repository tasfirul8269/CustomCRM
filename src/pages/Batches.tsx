import { useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Plus, Search, Filter, Edit, Trash2, Calendar, Users, Clock } from 'lucide-react';
import BatchForm from '../components/forms/BatchForm';
import { Batch } from '../types/batch';

export default function Batches() {
  const [batches, setBatches] = useState<Batch[]>([{
    id: '1',
    name: 'WEB-2023-01',
    course: 'Web Development Bootcamp',
    startDate: '2023-10-15',
    endDate: '2023-12-20',
    schedule: 'Mon, Wed, Fri (6:00 PM - 9:00 PM)',
    location: 'Online',
    instructor: 'Sarah Johnson',
    status: 'ongoing',
    maxStudents: 25,
    currentStudents: 18,
    createdAt: '2023-09-01',
    updatedAt: '2023-09-01'
  }, {
    id: '2',
    name: 'DS-2023-02',
    course: 'Data Science Fundamentals',
    startDate: '2023-11-01',
    endDate: '2024-01-15',
    schedule: 'Tue, Thu (7:00 PM - 9:30 PM)',
    location: 'Campus A',
    instructor: 'Michael Chen',
    status: 'upcoming',
    maxStudents: 20,
    currentStudents: 15,
    createdAt: '2023-09-15',
    updatedAt: '2023-09-15'
  }]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddBatchForm, setShowAddBatchForm] = useState(false);

  const filteredBatches = batches.filter(batch => 
    batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddBatch = (data: any) => {
    // In a real app, you would make an API call here
    const newBatch: Batch = {
      id: (batches.length + 1).toString(),
      name: data.batchNo,
      course: data.subjectCourse,
      startDate: data.startingDate,
      endDate: data.endingDate,
      schedule: 'To be scheduled',
      location: 'TBD',
      instructor: 'TBD',
      status: data.publishedStatus ? 'upcoming' : 'draft',
      maxStudents: 25,
      currentStudents: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    
    setBatches([...batches, newBatch]);
    setShowAddBatchForm(false);
  };

  const getStatusBadge = (status: Batch['status']) => {
    const styles = {
      upcoming: 'bg-blue-100 text-blue-800',
      ongoing: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
      draft: 'bg-yellow-100 text-yellow-800'
    };
    return `px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`;
  };

  const getProgressPercentage = (current: number, max: number) => {
    return Math.min(100, Math.round((current / max) * 100));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Batches</h1>
          <p className="text-gray-600 mt-2">Manage your training batches and schedules</p>
        </div>
        <Button onClick={() => setShowAddBatchForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Batch
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
                <option>Ongoing</option>
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
        {filteredBatches.map((batch) => (
          <Card key={batch.id} className="overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{batch.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{batch.course}</p>
                </div>
                <span className={getStatusBadge(batch.status)}>
                  {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
                </span>
              </div>
              
              <div className="mt-4 space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{new Date(batch.startDate).toLocaleDateString()} - {new Date(batch.endDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{batch.schedule}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="flex-1">
                    {batch.currentStudents} / {batch.maxStudents} students
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${getProgressPercentage(batch.currentStudents, batch.maxStudents)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {getProgressPercentage(batch.currentStudents, batch.maxStudents)}% full
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {batch.location}
                </span>
                <div className="flex space-x-2">
                  <button className="p-1 text-gray-400 hover:text-blue-600">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Batch Form Modal */}
      {showAddBatchForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add New Batch</h2>
                <button 
                  onClick={() => setShowAddBatchForm(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <BatchForm 
                onSubmit={handleAddBatch} 
                onCancel={() => setShowAddBatchForm(false)} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
