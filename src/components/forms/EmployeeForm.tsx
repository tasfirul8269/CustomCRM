import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Employee } from '../../types/employee';
import Button from '../ui/Button';
import api from '../../services/api';

interface EmployeeFormProps {
  initialData?: Partial<Employee>;
  onSubmit: (data: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function EmployeeForm({
  initialData = {},
  onSubmit,
  onCancel,
  isLoading = false,
}: EmployeeFormProps) {
  const [formData, setFormData] = useState({
    photo: null as File | null,
    email: initialData.email || '',
    mobileNumber: initialData.mobileNumber || '',
    addressLine1: initialData.addressLine1 || '',
    position: initialData.position || 'Staff',
    status: initialData.status || 'Live',
    fullName: initialData.fullName || '',
    dateOfBirth: initialData.dateOfBirth || '',
    licenseNumber: initialData.licenseNumber || '',
    addressLine2: initialData.addressLine2 || '',
    joiningDate: initialData.joiningDate || '',
    leavingDate: initialData.leavingDate || '',
    signature: null as File | null,
    contactNumber: initialData.contactNumber || '',
    gender: initialData.gender || '',
    employeeVendor: initialData.employeeVendor || '',
    note: initialData.note || '',
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(initialData.photo || null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(initialData.signature || null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Format dates when initialData changes (for editing)
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

      setFormData(prev => ({
        ...prev,
        dateOfBirth: formatDateForInput(initialData.dateOfBirth || ''),
        joiningDate: formatDateForInput(initialData.joiningDate || ''),
        leavingDate: formatDateForInput(initialData.leavingDate || ''),
      }));
    }
  }, [initialData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, field: 'photo' | 'signature') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        if (field === 'photo') {
          setPhotoPreview(reader.result as string);
        } else {
          setSignaturePreview(reader.result as string);
        }
      };
      
      reader.readAsDataURL(file);
      
      setFormData(prev => ({
        ...prev,
        [field]: file,
      }));
    }
  };

  const validateForm = () => {
    // No required field validation
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Upload photo if provided
        let photoUrl = initialData?.photo || '';
        if (formData.photo && formData.photo instanceof File) {
          const photoFormData = new FormData();
          photoFormData.append('image', formData.photo);
          const photoResponse = await api.post('/upload/image', photoFormData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          photoUrl = photoResponse.data.url;
        }

        // Upload signature if provided
        let signatureUrl = initialData?.signature || '';
        if (formData.signature && formData.signature instanceof File) {
          const signatureFormData = new FormData();
          signatureFormData.append('image', formData.signature);
          const signatureResponse = await api.post('/upload/image', signatureFormData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          signatureUrl = signatureResponse.data.url;
        }

        // Prepare employee data
        const employeeData = {
          fullName: formData.fullName,
          email: formData.email,
          mobileNumber: formData.mobileNumber,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          position: formData.position,
          status: formData.status,
          dateOfBirth: formData.dateOfBirth,
          licenseNumber: formData.licenseNumber,
          joiningDate: formData.joiningDate,
          leavingDate: formData.leavingDate || undefined,
          contactNumber: formData.contactNumber,
          gender: formData.gender,
          employeeVendor: formData.employeeVendor,
          note: formData.note,
          photo: photoUrl,
          signature: signatureUrl,
        };

        onSubmit(employeeData as any);
      } catch (error) {
        console.error('Error uploading files:', error);
        // Handle upload error
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Photo
          </label>
          <div className="flex items-center">
            <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">No photo</span>
                </div>
              )}
            </div>
            <label className="ml-4">
              <div className="py-2 px-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                Change
                <input
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'photo')}
                />
              </div>
            </label>
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors?.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter email address"
          />
          {errors?.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Mobile Number */}
        <div className="col-span-1">
          <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
            Mobile Number
          </label>
          <input
            type="tel"
            id="mobileNumber"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Full Name */}
        <div className="col-span-1">
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Date of Birth */}
        <div className="col-span-1">
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
            Date of Birth
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* License Number */}
        <div className="col-span-1">
          <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">
            License No.
          </label>
          <input
            type="text"
            id="licenseNumber"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Address Line 1 */}
        <div className="col-span-1">
          <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700">
            Address Line 1
          </label>
          <input
            type="text"
            id="addressLine1"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Address Line 2 */}
        <div className="col-span-1">
          <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700">
            Address Line 2
          </label>
          <input
            type="text"
            id="addressLine2"
            name="addressLine2"
            value={formData.addressLine2}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Position */}
        <div className="col-span-1">
          <label htmlFor="position" className="block text-sm font-medium text-gray-700">
            Position
          </label>
          <select
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="Manager">Manager</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Staff">Staff</option>
          </select>
        </div>

        {/* Status */}
        <div className="col-span-1">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="Live">Live</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Joining Date */}
        <div className="col-span-1">
          <label htmlFor="joiningDate" className="block text-sm font-medium text-gray-700">
            Joining Date
          </label>
          <input
            type="date"
            id="joiningDate"
            name="joiningDate"
            value={formData.joiningDate}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Leaving Date */}
        <div className="col-span-1">
          <label htmlFor="leavingDate" className="block text-sm font-medium text-gray-700">
            Leaving Date
          </label>
          <input
            type="date"
            id="leavingDate"
            name="leavingDate"
            value={formData.leavingDate}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Signature Upload */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Signature
          </label>
          <div className="mt-1">
            {signaturePreview ? (
              <div className="h-20 w-full border border-gray-300 rounded-md p-2">
                <img src={signaturePreview} alt="Signature Preview" className="h-full object-contain" />
              </div>
            ) : (
              <div className="h-20 w-full border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                <span className="text-gray-400">Upload signature</span>
              </div>
            )}
            <label className="mt-2 block">
              <span className="sr-only">Choose signature file</span>
              <input
                type="file"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'signature')}
              />
            </label>
          </div>
        </div>

        {/* Contact Number */}
        <div className="col-span-1">
          <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
            Contact Number
          </label>
          <input
            type="tel"
            id="contactNumber"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Gender */}
        <div className="col-span-1">
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>

        {/* Employee Vendor */}
        <div className="col-span-1">
          <label htmlFor="employeeVendor" className="block text-sm font-medium text-gray-700">
            Employee Vendor (Employer)
          </label>
          <input
            type="text"
            id="employeeVendor"
            name="employeeVendor"
            value={formData.employeeVendor}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Note */}
      <div className="col-span-2">
        <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
          Note
        </label>
        <textarea
          id="note"
          name="note"
          rows={4}
          value={formData.note}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors?.note ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter notes here"
        />
        <div className="flex justify-between mt-1">
          {errors?.note && <p className="text-red-500 text-sm">{errors.note}</p>}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 mt-8 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          className="px-4 py-2"
        >
          {isLoading ? 'Saving...' : 'Save Employee'}
        </Button>
      </div>
    </form>
  );
}
