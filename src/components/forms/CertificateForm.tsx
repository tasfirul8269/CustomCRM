import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { Certificate } from '../../types/certificate';

interface CertificateFormData {
  student: string;
  course: string;
  issueDate: string;
  certificateNumber: string;
  status: 'pending' | 'issued' | 'dispatched';
  sentDate?: string;
  doorNumber?: string;
}

interface CertificateFormProps {
  onSubmit: (data: CertificateFormData) => void;
  onCancel: () => void;
  initialData?: Certificate;
}

export default function CertificateForm({ onSubmit, onCancel, initialData }: CertificateFormProps) {
  const [formData, setFormData] = useState<CertificateFormData>({
    student: '',
    course: '',
    issueDate: new Date().toISOString().split('T')[0],
    certificateNumber: '',
    status: 'pending',
    sentDate: '',
    doorNumber: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with initial data if editing
  useEffect(() => {
    if (initialData) {
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
        student: initialData.student,
        course: initialData.course,
        issueDate: formatDateForInput(initialData.issueDate),
        certificateNumber: initialData.certificateNumber,
        status: initialData.status,
        sentDate: formatDateForInput(initialData.sentDate || ''),
        doorNumber: initialData.doorNumber || '',
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.student) newErrors.student = 'Student is required';
    if (!formData.course) newErrors.course = 'Course is required';
    if (!formData.issueDate) newErrors.issueDate = 'Issue date is required';
    if (!formData.certificateNumber) newErrors.certificateNumber = 'Certificate number is required';

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
            Student *
          </label>
          <input
            type="text"
            value={formData.student}
            onChange={(e) => setFormData(prev => ({ ...prev, student: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.student ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter student name"
          />
          {errors.student && <p className="text-red-500 text-sm mt-1">{errors.student}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course *
          </label>
          <select
            value={formData.course}
            onChange={(e) => setFormData(prev => ({ ...prev, course: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.course ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select course</option>
            {availableCourses.map((course) => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
          {errors.course && <p className="text-red-500 text-sm mt-1">{errors.course}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Issue Date (DD/MM/YYYY) *
          </label>
          <input
            type="date"
            value={formData.issueDate}
            onChange={(e) => setFormData(prev => ({ ...prev, issueDate: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.issueDate ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.issueDate && <p className="text-red-500 text-sm mt-1">{errors.issueDate}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Certificate Number *
          </label>
          <input
            type="text"
            value={formData.certificateNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, certificateNumber: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.certificateNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter certificate number"
          />
          {errors.certificateNumber && <p className="text-red-500 text-sm mt-1">{errors.certificateNumber}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status *
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'pending' | 'issued' | 'dispatched' }))}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.status ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="pending">Pending</option>
            <option value="issued">Issued</option>
            <option value="dispatched">Dispatched</option>
          </select>
          {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sent Date (DD/MM/YYYY)
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
            Door Number (Address)
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