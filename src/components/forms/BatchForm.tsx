import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { Batch } from '../../types/batch';
import { Course } from '../../types';
import api from '../../services/api';

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
  initialData?: Batch | null;
}

export default function BatchForm({ onSubmit, onCancel, initialData }: BatchFormProps) {
  const [formData, setFormData] = useState<BatchFormData>({
    batchNo: '',
    subjectCourse: '',
    startingDate: '',
    endingDate: '',
    publishedStatus: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  // Fetch courses from API
  const fetchCourses = async () => {
    try {
      setLoadingCourses(true);
      const response = await api.get('/courses');
      setCourses(response.data);
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setLoadingCourses(false);
    }
  };

  // Initialize form with initial data if editing
  useEffect(() => {
    if (initialData) {
      // Convert ISO date strings to yyyy-MM-dd format for the form
      const formatDateForInput = (dateString: string) => {
        if (!dateString) return '';
        try {
          const date = new Date(dateString);
          if (isNaN(date.getTime())) return '';
          return date.toISOString().split('T')[0];
        } catch (error) {
          console.error('Error formatting date:', error);
          return '';
        }
      };

      setFormData({
        batchNo: initialData.batchNo || '',
        subjectCourse: initialData.subjectCourse || '',
        startingDate: formatDateForInput(initialData.startingDate),
        endingDate: formatDateForInput(initialData.endingDate),
        publishedStatus: initialData.publishedStatus || true,
      });
    }
  }, [initialData]);

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  const validateForm = () => {
    // No required field validation
    setErrors({});
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

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
            disabled={loadingCourses}
          >
            <option value="">{loadingCourses ? 'Loading courses...' : 'Select course'}</option>
            {courses.map((course, index) => (
              <option key={course.id || `course-${index}`} value={course.title}>
                {course.title} ({course.courseCode})
              </option>
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
          {initialData ? 'Update Batch' : 'Add Batch'}
        </Button>
      </div>
    </form>
  );
}