import React, { useState } from 'react';
import Button from '../ui/Button';

interface CourseFormData {
  courseTitle: string;
  courseCode: string;
  assignmentDuration: number;
  published: boolean;
}

interface CourseFormProps {
  onSubmit: (data: CourseFormData) => void;
  onCancel: () => void;
}

export default function CourseForm({ onSubmit, onCancel }: CourseFormProps) {
  const [formData, setFormData] = useState<CourseFormData>({
    courseTitle: '',
    courseCode: '',
    assignmentDuration: 0,
    published: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.courseTitle.trim()) newErrors.courseTitle = 'Course title is required';
    if (!formData.courseCode.trim()) newErrors.courseCode = 'Course code is required';
    if (formData.assignmentDuration <= 0) newErrors.assignmentDuration = 'Assignment duration must be greater than 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Title *
          </label>
          <input
            type="text"
            value={formData.courseTitle}
            onChange={(e) => setFormData(prev => ({ ...prev, courseTitle: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.courseTitle ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter course title"
          />
          {errors.courseTitle && <p className="text-red-500 text-sm mt-1">{errors.courseTitle}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Code *
          </label>
          <input
            type="text"
            value={formData.courseCode}
            onChange={(e) => setFormData(prev => ({ ...prev, courseCode: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.courseCode ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., CS101"
          />
          {errors.courseCode && <p className="text-red-500 text-sm mt-1">{errors.courseCode}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assignment Duration (Days) *
          </label>
          <input
            type="number"
            value={formData.assignmentDuration}
            onChange={(e) => setFormData(prev => ({ ...prev, assignmentDuration: parseInt(e.target.value) || 0 }))}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.assignmentDuration ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter duration in days"
            min="1"
          />
          {errors.assignmentDuration && <p className="text-red-500 text-sm mt-1">{errors.assignmentDuration}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Published *
          </label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="published"
                checked={formData.published}
                onChange={() => setFormData(prev => ({ ...prev, published: true }))}
                className="mr-2"
              />
              Yes
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="published"
                checked={!formData.published}
                onChange={() => setFormData(prev => ({ ...prev, published: false }))}
                className="mr-2"
              />
              No
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit">
          Save Course
        </Button>
      </div>
    </form>
  );
}