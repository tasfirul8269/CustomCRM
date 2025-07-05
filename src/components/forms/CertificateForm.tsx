import React, { useState, useEffect, useRef } from 'react';
import Button from '../ui/Button';
import { Certificate } from '../../types/certificate';
import api from '../../services/api';

interface Course {
  _id: string;
  title: string;
}

interface Student {
  _id: string;
  name: string;
}

interface CertificateFormData {
  student: string;
  course: string;
  issueDate: string;
  certificateNumber: string;
  status: 'pending' | 'issued' | 'dispatched';
  sentDate?: string;
  doorNumber?: string;
  zipCode?: string;
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
    zipCode: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  // For autocomplete dropdowns
  const [studentQuery, setStudentQuery] = useState('');
  const [showStudentSuggestions, setShowStudentSuggestions] = useState(false);
  const [courseQuery, setCourseQuery] = useState('');
  const [showCourseSuggestions, setShowCourseSuggestions] = useState(false);
  const studentInputRef = useRef<HTMLInputElement>(null);
  const courseInputRef = useRef<HTMLInputElement>(null);

  // Filtered suggestions
  const filteredStudentSuggestions = students.filter(s =>
    s.name.toLowerCase().includes(studentQuery.toLowerCase())
  );
  const filteredCourseSuggestions = courses.filter(c =>
    c.title.toLowerCase().includes(courseQuery.toLowerCase())
  );

  // Fetch courses and students
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [coursesRes, studentsRes] = await Promise.all([
          api.get('/courses'),
          api.get('/students')
        ]);
        setCourses(coursesRes.data);
        setStudents(studentsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        student: typeof initialData.student === 'object' ? initialData.student._id : initialData.student || '',
        course: typeof initialData.course === 'object' ? initialData.course._id : initialData.course || '',
        issueDate: formatDateForInput(initialData.issueDate),
        certificateNumber: initialData.certificateNumber,
        status: initialData.status,
        sentDate: formatDateForInput(initialData.sentDate || ''),
        doorNumber: initialData.doorNumber || '',
        zipCode: initialData.zipCode || '',
      });
    }
  }, [initialData]);

  // Set initial query when editing
  useEffect(() => {
    if (initialData && students.length && courses.length) {
      const studentObj = students.find(s => s._id === formData.student);
      setStudentQuery(studentObj ? studentObj.name : '');
      const courseObj = courses.find(c => c._id === formData.course);
      setCourseQuery(courseObj ? courseObj.title : '');
    }
  }, [initialData, students, courses, formData.student, formData.course]);

  const validateForm = () => {
    // No required field validation
    setErrors({});
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Convert dates to proper format for backend
      const submitData = {
        ...formData,
        issueDate: new Date(formData.issueDate).toISOString(),
        sentDate: formData.sentDate ? new Date(formData.sentDate).toISOString() : undefined,
      };
      onSubmit(submitData);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-lg">Loading form data...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Student Autocomplete */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Student
          </label>
          <input
            ref={studentInputRef}
            type="text"
            value={studentQuery}
            onChange={e => {
              setStudentQuery(e.target.value);
              setShowStudentSuggestions(true);
              setFormData(prev => ({ ...prev, student: '' }));
            }}
            onFocus={() => setShowStudentSuggestions(true)}
            onBlur={() => setTimeout(() => setShowStudentSuggestions(false), 100)}
            placeholder="Type to search student..."
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.student ? 'border-red-500' : 'border-gray-300'}`}
          />
          {showStudentSuggestions && studentQuery && (
            <ul className="absolute z-10 bg-white border border-gray-200 rounded-lg mt-1 w-full max-h-48 overflow-y-auto shadow-lg">
              {filteredStudentSuggestions.length === 0 && (
                <li className="px-3 py-2 text-gray-500">No students found</li>
              )}
              {filteredStudentSuggestions.map(student => (
                <li
                  key={student._id}
                  className="px-3 py-2 cursor-pointer hover:bg-blue-100"
                  onMouseDown={() => {
                    setFormData(prev => ({ ...prev, student: student._id }));
                    setStudentQuery(student.name);
                    setShowStudentSuggestions(false);
                  }}
                >
                  {student.name}
                </li>
              ))}
            </ul>
          )}
          {errors.student && <p className="text-red-500 text-sm mt-1">{errors.student}</p>}
        </div>
        {/* Course Autocomplete */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course
          </label>
          <input
            ref={courseInputRef}
            type="text"
            value={courseQuery}
            onChange={e => {
              setCourseQuery(e.target.value);
              setShowCourseSuggestions(true);
              setFormData(prev => ({ ...prev, course: '' }));
            }}
            onFocus={() => setShowCourseSuggestions(true)}
            onBlur={() => setTimeout(() => setShowCourseSuggestions(false), 100)}
            placeholder="Type to search course..."
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.course ? 'border-red-500' : 'border-gray-300'}`}
          />
          {showCourseSuggestions && courseQuery && (
            <ul className="absolute z-10 bg-white border border-gray-200 rounded-lg mt-1 w-full max-h-48 overflow-y-auto shadow-lg">
              {filteredCourseSuggestions.length === 0 && (
                <li className="px-3 py-2 text-gray-500">No courses found</li>
              )}
              {filteredCourseSuggestions.map(course => (
                <li
                  key={course._id}
                  className="px-3 py-2 cursor-pointer hover:bg-blue-100"
                  onMouseDown={() => {
                    setFormData(prev => ({ ...prev, course: course._id }));
                    setCourseQuery(course.title);
                    setShowCourseSuggestions(false);
                  }}
                >
                  {course.title}
                </li>
              ))}
            </ul>
          )}
          {errors.course && <p className="text-red-500 text-sm mt-1">{errors.course}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Issue Date (DD/MM/YYYY)
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
            Certificate Number
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
            Status
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Zip code
          </label>
          <input
            type="text"
            value={formData.zipCode}
            onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.zipCode ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter zip code"
          />
          {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
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