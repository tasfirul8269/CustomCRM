import React, { useState } from 'react';
import Button from '../ui/Button';

interface CertificateFormData {
  sentDate: string;
  name: string;
  doorNumber: string;
  courseName: string;
}

interface CertificateFormProps {
  onSubmit: (data: CertificateFormData) => void;
  onCancel: () => void;
}

export default function CertificateForm({ onSubmit, onCancel }: CertificateFormProps) {
  const [formData, setFormData] = useState<CertificateFormData>({
    sentDate: new Date().toISOString().split('T')[0],
    name: '',
    doorNumber: '',
    courseName: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.sentDate) newErrors.sentDate = 'Sent date is required';
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.doorNumber.trim()) newErrors.doorNumber = 'Door number is required';
    if (!formData.courseName) newErrors.courseName = 'Course name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const availableCourses = [
    'React Fundamentals',
    'JavaScript Advanced',
    'Python for Beginners',
    'UI/UX Design',
    'Data Science Basics',
    'Node.js Backend',
    'Digital Marketing',
    'Machine Learning',
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sent Date (DD/MM/YYYY) *
          </label>
          <input
            type="date"
            value={formData.sentDate}
            onChange={(e) => setFormData(prev => ({ ...prev, sentDate: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.sentDate ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.sentDate && <p className="text-red-500 text-sm mt-1">{errors.sentDate}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter recipient name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Door Number (Address) *
          </label>
          <input
            type="text"
            value={formData.doorNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, doorNumber: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.doorNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter door number/address"
          />
          {errors.doorNumber && <p className="text-red-500 text-sm mt-1">{errors.doorNumber}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Name *
          </label>
          <select
            value={formData.courseName}
            onChange={(e) => setFormData(prev => ({ ...prev, courseName: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.courseName ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select course</option>
            {availableCourses.map((course) => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
          {errors.courseName && <p className="text-red-500 text-sm mt-1">{errors.courseName}</p>}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Add Certificate
        </Button>
      </div>
    </form>
  );
}