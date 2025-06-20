import React, { useState } from 'react';
import Button from '../ui/Button';

interface BatchFormData {
  batchNo: string;
  subjectCourse: string;
  startingDate: string;
  endingDate: string;
  publishedStatus: boolean;
}

interface BatchFormProps {
  onSubmit: (data: BatchFormData) => void;
  onCancel: () => void;
}

export default function BatchForm({ onSubmit, onCancel }: BatchFormProps) {
  const [formData, setFormData] = useState<BatchFormData>({
    batchNo: '',
    subjectCourse: '',
    startingDate: '',
    endingDate: '',
    publishedStatus: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.batchNo.trim()) newErrors.batchNo = 'Batch number is required';
    if (!formData.subjectCourse) newErrors.subjectCourse = 'Subject/Course is required';
    if (!formData.startingDate) newErrors.startingDate = 'Starting date is required';
    if (!formData.endingDate) newErrors.endingDate = 'Ending date is required';
    
    if (formData.startingDate && formData.endingDate) {
      if (new Date(formData.startingDate) >= new Date(formData.endingDate)) {
        newErrors.endingDate = 'Ending date must be after starting date';
      }
    }

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
            Batch No *
          </label>
          <input
            type="text"
            value={formData.batchNo}
            onChange={(e) => setFormData(prev => ({ ...prev, batchNo: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.batchNo ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., BATCH-001"
          />
          {errors.batchNo && <p className="text-red-500 text-sm mt-1">{errors.batchNo}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject/Course *
          </label>
          <select
            value={formData.subjectCourse}
            onChange={(e) => setFormData(prev => ({ ...prev, subjectCourse: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.subjectCourse ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select course</option>
            {availableCourses.map((course) => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
          {errors.subjectCourse && <p className="text-red-500 text-sm mt-1">{errors.subjectCourse}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Starting Date *
          </label>
          <input
            type="date"
            value={formData.startingDate}
            onChange={(e) => setFormData(prev => ({ ...prev, startingDate: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.startingDate ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.startingDate && <p className="text-red-500 text-sm mt-1">{errors.startingDate}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ending Date *
          </label>
          <input
            type="date"
            value={formData.endingDate}
            onChange={(e) => setFormData(prev => ({ ...prev, endingDate: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.endingDate ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.endingDate && <p className="text-red-500 text-sm mt-1">{errors.endingDate}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Published Status
        </label>
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="publishedStatus"
              checked={formData.publishedStatus}
              onChange={() => setFormData(prev => ({ ...prev, publishedStatus: true }))}
              className="mr-2"
            />
            Published
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="publishedStatus"
              checked={!formData.publishedStatus}
              onChange={() => setFormData(prev => ({ ...prev, publishedStatus: false }))}
              className="mr-2"
            />
            Draft
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Add Batch
        </Button>
      </div>
    </form>
  );
}