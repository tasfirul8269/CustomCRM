import React, { useState, useEffect, useRef } from 'react';
import Button from '../ui/Button';
import { Student, Vendor, Batch, Location } from '../../types';
import { Employee } from '../../types/employee';
import api from '../../services/api';
import Select from 'react-select';

interface StudentAdmissionFormProps {
  onSubmit: (student: Omit<Student, 'id'>) => void;
  onCancel: () => void;
  initialData?: Student | null;
}

export default function StudentAdmissionForm({ onSubmit, onCancel, initialData }: StudentAdmissionFormProps) {
  const [formData, setFormData] = useState({
    // Basic Information
    admissionDate: '',
    name: '',
    phone: '',
    email: '',
    gender: '',
    status: 'active' as 'active' | 'inactive' | 'graduated',
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
    employeeId: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingVendors, setLoadingVendors] = useState(true);
  const [loadingBatches, setLoadingBatches] = useState(true);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [paymentPlan, setPaymentPlan] = useState<{ date: string; amount: number; received: number }[]>([{ date: '', amount: 0, received: 0 }]);
  const didInit = useRef(false);
  const [initialSlots, setInitialSlots] = useState('');
  const [initialAdmissionType, setInitialAdmissionType] = useState('');

  // Fetch vendors, batches, and locations from API
  const fetchVendors = async () => {
    try {
      setLoadingVendors(true);
      const response = await api.get('/vendors');
      setVendors(response.data);
    } catch (err) {
      console.error('Error fetching vendors:', err);
    } finally {
      setLoadingVendors(false);
    }
  };

  const fetchBatches = async () => {
    try {
      setLoadingBatches(true);
      const response = await api.get('/batches');
      setBatches(response.data);
    } catch (err) {
      console.error('Error fetching batches:', err);
    } finally {
      setLoadingBatches(false);
    }
  };

  const fetchLocations = async () => {
    try {
      setLoadingLocations(true);
      const response = await api.get('/locations');
      setLocations(response.data);
    } catch (err) {
      console.error('Error fetching locations:', err);
    } finally {
      setLoadingLocations(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const response = await api.get('/employees');
      setEmployees(response.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    } finally {
      setLoadingEmployees(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchVendors();
    fetchBatches();
    fetchLocations();
    fetchEmployees();
  }, []);

  // Initialize form with initial data if editing
  useEffect(() => {
    if (initialData) {
      // Debug: log the paymentPlan received
      if (initialData.paymentPlan) {
        // eslint-disable-next-line no-console
        console.log('Editing paymentPlan:', initialData.paymentPlan);
      }
      setFormData({
        admissionDate: (function() {
          const d = initialData.enrollmentDate;
          if (!d) return new Date().toISOString().split('T')[0];
          if (typeof d === 'string' && d.length === 10 && d.match(/^\d{4}-\d{2}-\d{2}$/)) return d;
          const dateObj = new Date(d);
          if (!isNaN(dateObj.getTime())) return dateObj.toISOString().split('T')[0];
          return '';
        })(),
        name: initialData.name || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        gender: initialData.gender || '',
        status: initialData.status || 'active',
        batchNo: initialData.batchNo || '',
        vendor: initialData.vendor || '',
        location: initialData.location || '',
        bookedBy: typeof initialData.bookedBy === 'object' ? (initialData.bookedBy as any)?._id || '' : initialData.bookedBy || '',
        courseType: initialData.courseType || '',
        assignmentStatus: initialData.assignmentStatus || 'pending',
        assignmentDate: (function() {
          const d = initialData.assignmentDate;
          if (!d) return '';
          if (typeof d === 'string' && d.length === 10 && d.match(/^\d{4}-\d{2}-\d{2}$/)) return d;
          const dateObj = new Date(d);
          if (!isNaN(dateObj.getTime())) return dateObj.toISOString().split('T')[0];
          return '';
        })(),
        note: initialData.note || '',
        admissionType: initialData.admissionType || '',
        paymentSlots: initialData.paymentSlots || '',
        courseFee: initialData.courseFee || 0,
        discount: initialData.discount || 0,
        totalPaid: initialData.totalPaid || 0,
        received: initialData.received || 0,
        refund: initialData.refund || 0,
        balanceDue: initialData.balanceDue || 0,
        employeeId: initialData.employeeId || '',
      });
      if (Array.isArray(initialData.paymentPlan) && initialData.paymentPlan.length > 0) {
        setPaymentPlan(initialData.paymentPlan.map(row => {
          let dateStr = '';
          if (row.date) {
            if (typeof row.date === 'string' && row.date.length === 10 && row.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
              dateStr = row.date;
            } else {
              const d = new Date(row.date);
              if (!isNaN(d.getTime())) {
                dateStr = d.toISOString().split('T')[0];
              }
            }
          }
          return {
            date: dateStr,
            amount: typeof row.amount === 'number' ? row.amount : (parseFloat(row.amount) || 0),
            received: typeof row.received === 'number' ? row.received : (parseFloat(row.received) || 0)
          };
        }));
      } else {
        setPaymentPlan([{ date: '', amount: 0, received: 0 }]);
      }
      setInitialSlots(initialData.paymentSlots || '');
      setInitialAdmissionType(initialData.admissionType || '');
      didInit.current = true;
    }
  }, [initialData]);

  // Only update paymentPlan if the user changes slots/type after initial load
  useEffect(() => {
    if (
      formData.paymentSlots !== initialSlots ||
      formData.admissionType !== initialAdmissionType
    ) {
      if (formData.admissionType === 'price-plan') {
        let slots = parseInt(formData.paymentSlots);
        if (isNaN(slots) || slots < 1) slots = 1;
        setPaymentPlan((prev) => {
          const newPlan = [...prev];
          if (newPlan.length < slots) {
            while (newPlan.length < slots) newPlan.push({ date: '', amount: 0, received: 0 });
          } else if (newPlan.length > slots) {
            newPlan.length = slots;
          }
          return newPlan;
        });
      } else {
        setPaymentPlan([{ date: '', amount: 0, received: 0 }]);
      }
    }
  }, [formData.paymentSlots, formData.admissionType]);

  const validateForm = () => {
    // No required field validation
    setErrors({});
    return true;
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
        address: '', // Default empty value
        city: '', // Default empty value
        postcode: '', // Default empty value
        gender: formData.gender,
        batchNo: formData.batchNo,
        vendor: formData.vendor,
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
        bookedBy: formData.bookedBy,
        employeeId: formData.employeeId,
        // Add paymentPlan if price-plan
        ...(formData.admissionType === 'price-plan' ? { paymentPlan } : {}),
        // Optional fields with default values
        resit: undefined,
        microtech: undefined,
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
              Admission Date
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
              Student Name
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
              Contact Number
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
              Email ID
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
              Gender
            </label>
            <Select
              value={formData.gender ? { value: formData.gender, label: formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1) } : null}
              onChange={option => setFormData(prev => ({ ...prev, gender: option ? option.value : '' }))}
              options={['male', 'female', 'other'].map(g => ({ value: g, label: g.charAt(0).toUpperCase() + g.slice(1) }))}
              isClearable
              isSearchable
              placeholder="Select gender"
              classNamePrefix="react-select"
            />
            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' | 'graduated' }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="graduated">Graduated</option>
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
              Batch No
            </label>
            <Select
              value={batches.find(b => b.batchNo === formData.batchNo) ? {
                value: formData.batchNo,
                label: `${batches.find(b => b.batchNo === formData.batchNo)?.batchNo} : ${new Date(batches.find(b => b.batchNo === formData.batchNo)?.startingDate || '').toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' })} - ${new Date(batches.find(b => b.batchNo === formData.batchNo)?.endingDate || '').toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' })}`
              } : null}
              onChange={option => setFormData(prev => ({ ...prev, batchNo: option ? option.value : '' }))}
              options={batches.map(batch => ({
                value: batch.batchNo,
                label: `${batch.batchNo} : ${new Date(batch.startingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' })} - ${new Date(batch.endingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' })}`
              }))}
              isClearable
              isSearchable
              placeholder={loadingBatches ? 'Loading batches...' : 'Select batch'}
              isLoading={loadingBatches}
              classNamePrefix="react-select"
            />
            {errors.batchNo && <p className="text-red-500 text-sm mt-1">{errors.batchNo}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vendor
            </label>
            <Select
              value={vendors.find(v => v.name === formData.vendor) ? {
                value: formData.vendor,
                label: vendors.find(v => v.name === formData.vendor)?.company
                  ? `${vendors.find(v => v.name === formData.vendor)?.name} - ${vendors.find(v => v.name === formData.vendor)?.company}`
                  : vendors.find(v => v.name === formData.vendor)?.name
              } : null}
              onChange={option => setFormData(prev => ({ ...prev, vendor: option ? option.value : '' }))}
              options={vendors.map(vendor => ({
                value: vendor.name,
                label: vendor.company ? `${vendor.name} - ${vendor.company}` : vendor.name
              }))}
              isClearable
              isSearchable
              placeholder={loadingVendors ? 'Loading vendors...' : 'Select vendor'}
              isLoading={loadingVendors}
              classNamePrefix="react-select"
            />
            {errors.vendor && <p className="text-red-500 text-sm mt-1">{errors.vendor}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <Select
              value={locations.find(l => l.locationName === formData.location) ? {
                value: formData.location,
                label: locations.find(l => l.locationName === formData.location)?.locationName
              } : null}
              onChange={option => setFormData(prev => ({ ...prev, location: option ? option.value : '' }))}
              options={locations.map(location => ({
                value: location.locationName,
                label: location.locationName
              }))}
              isClearable
              isSearchable
              placeholder={loadingLocations ? 'Loading locations...' : 'Select location'}
              isLoading={loadingLocations}
              classNamePrefix="react-select"
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Booked By
            </label>
            <Select
              value={formData.bookedBy ? { value: formData.bookedBy, label: formData.bookedBy.charAt(0).toUpperCase() + formData.bookedBy.slice(1) } : null}
              onChange={option => setFormData(prev => ({ ...prev, bookedBy: option ? option.value : '' }))}
              options={["phone", "online", "face-to-face", "invoice"].map(method => ({ value: method, label: method.charAt(0).toUpperCase() + method.slice(1) }))}
              isClearable
              isSearchable
              placeholder="Select booking method"
              classNamePrefix="react-select"
            />
            {errors.bookedBy && <p className="text-red-500 text-sm mt-1">{errors.bookedBy}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Type
            </label>
            <Select
              value={formData.courseType ? { value: formData.courseType, label: formData.courseType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) } : null}
              onChange={option => setFormData(prev => ({ ...prev, courseType: option ? option.value : '' }))}
              options={[
                { value: 'class-based', label: 'Class Based' },
                { value: 'online-distance', label: 'Online/Distance Learning' },
                { value: 'blended', label: 'Blended Learning' }
              ]}
              isClearable
              isSearchable
              placeholder="Select course type"
              classNamePrefix="react-select"
            />
            {errors.courseType && <p className="text-red-500 text-sm mt-1">{errors.courseType}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assignment Status
            </label>
            <Select
              value={formData.assignmentStatus ? { value: formData.assignmentStatus, label: formData.assignmentStatus.charAt(0).toUpperCase() + formData.assignmentStatus.slice(1) } : null}
              onChange={option => setFormData(prev => ({ ...prev, assignmentStatus: option ? option.value as 'pending' | 'complete' : 'pending' }))}
              options={['pending', 'complete'].map(status => ({ value: status, label: status.charAt(0).toUpperCase() + status.slice(1) }))}
              isClearable
              isSearchable
              placeholder="Select assignment status"
              classNamePrefix="react-select"
            />
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign Employee
            </label>
            <Select
              value={employees.find(e => (e.id || e._id) === formData.employeeId) ? {
                value: formData.employeeId,
                label: `${employees.find(e => (e.id || e._id) === formData.employeeId)?.fullName} (${employees.find(e => (e.id || e._id) === formData.employeeId)?.position})`
              } : null}
              onChange={option => setFormData(prev => ({ ...prev, employeeId: option ? option.value : '' }))}
              options={employees.map(emp => ({
                value: emp.id || emp._id,
                label: `${emp.fullName} (${emp.position})`
              }))}
              isClearable
              isSearchable
              placeholder={loadingEmployees ? 'Loading employees...' : 'Select employee'}
              isLoading={loadingEmployees}
              classNamePrefix="react-select"
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
              Admission Type
            </label>
            <Select
              value={formData.admissionType ? { value: formData.admissionType, label: formData.admissionType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) } : null}
              onChange={option => setFormData(prev => ({ ...prev, admissionType: option ? option.value : '' }))}
              options={[
                { value: 'general', label: 'General' },
                { value: 'price-plan', label: 'Price Plan' }
              ]}
              isClearable
              isSearchable
              placeholder="Select admission type"
              classNamePrefix="react-select"
            />
            {errors.admissionType && <p className="text-red-500 text-sm mt-1">{errors.admissionType}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Slots
            </label>
            <input
              type="number"
              min={1}
              step={1}
              value={formData.paymentSlots}
              onChange={e => {
                // Allow empty string for typing
                setFormData(prev => ({ ...prev, paymentSlots: e.target.value }));
              }}
              onBlur={e => {
                let val = parseInt(e.target.value);
                if (isNaN(val) || val < 1) val = 1;
                setFormData(prev => ({ ...prev, paymentSlots: val.toString() }));
              }}
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
        {/* Dynamic Payment Plan Rows */}
        {formData.admissionType === 'price-plan' && (
          <div className="mt-6">
            <h4 className="text-md font-semibold mb-2">Payment Plan</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">#</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Amount</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Received</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentPlan.map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-2">{idx + 1}</td>
                      <td className="px-4 py-2">
                        <input
                          type="date"
                          value={row.date || ''}
                          onChange={e => {
                            const newPlan = [...paymentPlan];
                            newPlan[idx].date = e.target.value;
                            setPaymentPlan(newPlan);
                          }}
                          className="border border-gray-300 rounded px-2 py-1 w-36"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={typeof row.amount === 'number' && !isNaN(row.amount) ? row.amount : ''}
                          onChange={e => {
                            const newPlan = [...paymentPlan];
                            newPlan[idx].amount = parseFloat(e.target.value) || 0;
                            setPaymentPlan(newPlan);
                          }}
                          className="border border-gray-300 rounded px-2 py-1 w-24"
                          min="0"
                          step="0.01"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={typeof row.received === 'number' && !isNaN(row.received) ? row.received : ''}
                          onChange={e => {
                            const newPlan = [...paymentPlan];
                            newPlan[idx].received = parseFloat(e.target.value) || 0;
                            setPaymentPlan(newPlan);
                          }}
                          className="border border-gray-300 rounded px-2 py-1 w-24"
                          min="0"
                          step="0.01"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Student' : 'Add Student'}
        </Button>
      </div>
    </form>
  );
}