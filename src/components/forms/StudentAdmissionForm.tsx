import React, { useState } from 'react';
import Button from '../ui/Button';
import { Student } from '../../types';

interface StudentAdmissionFormProps {
  onSubmit: (student: Omit<Student, 'id'>) => void;
  onCancel: () => void;
}

export default function StudentAdmissionForm({ onSubmit, onCancel }: StudentAdmissionFormProps) {
  const [formData, setFormData] = useState({
    // Basic Information
    admissionDate: new Date().toISOString().split('T')[0],
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    postcode: '',
    gender: '',
    status: 'active' as 'active' | 'inactive',
    batchNo: '',
    vendor: '',
    location: '',
    bookedBy: '',
    courseType: '',
    assignmentStatus: 'pending' as 'pending' | 'complete',
    assignmentDate: '',
    note: '',
    
    // Payment Information
    admissionType: '',
    paymentSlots: '',
    courseFee: 0,
    discount: 0,
    totalPaid: 0,
    received: 0,
    refund: 0,
    balanceDue: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Student name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Contact number is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.postcode.trim()) newErrors.postcode = 'Postcode is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.batchNo) newErrors.batchNo = 'Batch number is required';
    if (!formData.vendor) newErrors.vendor = 'Vendor is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.bookedBy) newErrors.bookedBy = 'Booking method is required';
    if (!formData.courseType) newErrors.courseType = 'Course type is required';
    if (!formData.admissionType) newErrors.admissionType = 'Admission type is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const newStudent: Omit<Student, 'id'> = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        enrollmentDate: formData.admissionDate,
        status: formData.status,
        courses: [], // Will be populated based on batch/course selection
        totalPaid: formData.totalPaid,
        // Additional fields for the extended student model
        address: formData.address,
        city: formData.city,
        postcode: formData.postcode,
        gender: formData.gender,
        batchNo: formData.batchNo,
        vendor: formData.vendor,
        bookedBy: formData.bookedBy,
        courseType: formData.courseType,
        assignmentStatus: formData.assignmentStatus,
        assignmentDate: formData.assignmentDate,
        note: formData.note,
        admissionType: formData.admissionType,
        paymentSlots: formData.paymentSlots,
        courseFee: formData.courseFee,
        discount: formData.discount,
        received: formData.received,
        refund: formData.refund,
        balanceDue: formData.balanceDue,
      };
      onSubmit(newStudent);
    }
  };

  const calculateBalanceDue = () => {
    const balance = formData.courseFee - formData.discount - formData.received + formData.refund;
    setFormData(prev => ({ ...prev, balanceDue: Math.max(0, balance) }));
  };

  React.useEffect(() => {
    calculateBalanceDue();
  }, [formData.courseFee, formData.discount, formData.received, formData.refund]);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information Section */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admission Date *
            </label>
            <input
              type="date"
              value={formData.admissionDate}
              onChange={(e) => setFormData(prev => ({ ...prev, admissionDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Student Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter full name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Number *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter phone number"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email ID *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter email address"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter full address"
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.city ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter city"
            />
            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Postcode *
            </label>
            <input
              type="text"
              value={formData.postcode}
              onChange={(e) => setFormData(prev => ({ ...prev, postcode: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.postcode ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter postcode"
            />
            {errors.postcode && <p className="text-red-500 text-sm mt-1">{errors.postcode}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender *
            </label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.gender ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Course & Batch Information */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Course & Batch Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Batch No *
            </label>
            <select
              value={formData.batchNo}
              onChange={(e) => setFormData(prev => ({ ...prev, batchNo: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.batchNo ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select batch</option>
              <option value="batch-1">Batch 1</option>
              <option value="batch-2">Batch 2</option>
              <option value="batch-3">Batch 3</option>
              <option value="batch-4">Batch 4</option>
              <option value="batch-5">Batch 5</option>
            </select>
            {errors.batchNo && <p className="text-red-500 text-sm mt-1">{errors.batchNo}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vendor *
            </label>
            <select
              value={formData.vendor}
              onChange={(e) => setFormData(prev => ({ ...prev, vendor: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.vendor ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select vendor</option>
              <option value="vendor-1">TechEd Solutions</option>
              <option value="vendor-2">Learning Hub</option>
              <option value="vendor-3">SkillForge</option>
            </select>
            {errors.vendor && <p className="text-red-500 text-sm mt-1">{errors.vendor}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <select
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select location</option>
              <option value="new-york">New York</option>
              <option value="los-angeles">Los Angeles</option>
              <option value="chicago">Chicago</option>
              <option value="houston">Houston</option>
            </select>
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Booked By *
            </label>
            <select
              value={formData.bookedBy}
              onChange={(e) => setFormData(prev => ({ ...prev, bookedBy: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.bookedBy ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select booking method</option>
              <option value="phone">Phone</option>
              <option value="online">Online</option>
              <option value="face-to-face">Face to Face</option>
              <option value="invoice">Invoice</option>
            </select>
            {errors.bookedBy && <p className="text-red-500 text-sm mt-1">{errors.bookedBy}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Type *
            </label>
            <select
              value={formData.courseType}
              onChange={(e) => setFormData(prev => ({ ...prev, courseType: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.courseType ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select course type</option>
              <option value="class-based">Class Based</option>
              <option value="online-distance">Online/Distance Learning</option>
              <option value="blended">Blended Learning</option>
            </select>
            {errors.courseType && <p className="text-red-500 text-sm mt-1">{errors.courseType}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assignment Status
            </label>
            <select
              value={formData.assignmentStatus}
              onChange={(e) => setFormData(prev => ({ ...prev, assignmentStatus: e.target.value as 'pending' | 'complete' }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="complete">Complete</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assignment Date
            </label>
            <input
              type="date"
              value={formData.assignmentDate}
              onChange={(e) => setFormData(prev => ({ ...prev, assignmentDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Note
          </label>
          <textarea
            value={formData.note}
            onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add any additional notes..."
          />
        </div>
      </div>

      {/* Payment Information */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admission Type *
            </label>
            <select
              value={formData.admissionType}
              onChange={(e) => setFormData(prev => ({ ...prev, admissionType: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.admissionType ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select admission type</option>
              <option value="general">General</option>
              <option value="price-plan">Price Plan</option>
            </select>
            {errors.admissionType && <p className="text-red-500 text-sm mt-1">{errors.admissionType}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Slots
            </label>
            <input
              type="text"
              value={formData.paymentSlots}
              onChange={(e) => setFormData(prev => ({ ...prev, paymentSlots: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 3 installments"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Fee
            </label>
            <input
              type="number"
              value={formData.courseFee}
              onChange={(e) => setFormData(prev => ({ ...prev, courseFee: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount
            </label>
            <input
              type="number"
              value={formData.discount}
              onChange={(e) => setFormData(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Paid
            </label>
            <input
              type="number"
              value={formData.totalPaid}
              onChange={(e) => setFormData(prev => ({ ...prev, totalPaid: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Received
            </label>
            <input
              type="number"
              value={formData.received}
              onChange={(e) => setFormData(prev => ({ ...prev, received: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Refund
            </label>
            <input
              type="number"
              value={formData.refund}
              onChange={(e) => setFormData(prev => ({ ...prev, refund: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Balance Due
            </label>
            <input
              type="number"
              value={formData.balanceDue}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Add Student
        </Button>
      </div>
    </form>
  );
}