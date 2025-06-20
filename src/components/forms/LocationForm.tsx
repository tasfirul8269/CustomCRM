import React, { useState } from 'react';
import Button from '../ui/Button';

interface LocationFormData {
  locationName: string;
  addressLine1: string;
  addressLine2: string;
  publishStatus: 'published' | 'draft';
}

interface LocationFormProps {
  onSubmit: (data: LocationFormData) => void;
  onCancel: () => void;
}

export default function LocationForm({ onSubmit, onCancel }: LocationFormProps) {
  const [formData, setFormData] = useState<LocationFormData>({
    locationName: '',
    addressLine1: '',
    addressLine2: '',
    publishStatus: 'published',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.locationName.trim()) newErrors.locationName = 'Location name is required';
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address line 1 is required';

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
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location Name *
        </label>
        <input
          type="text"
          value={formData.locationName}
          onChange={(e) => setFormData(prev => ({ ...prev, locationName: e.target.value }))}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.locationName ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter location name"
        />
        {errors.locationName && <p className="text-red-500 text-sm mt-1">{errors.locationName}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address Line 1 *
        </label>
        <input
          type="text"
          value={formData.addressLine1}
          onChange={(e) => setFormData(prev => ({ ...prev, addressLine1: e.target.value }))}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.addressLine1 ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter address line 1"
        />
        {errors.addressLine1 && <p className="text-red-500 text-sm mt-1">{errors.addressLine1}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address Line 2
        </label>
        <input
          type="text"
          value={formData.addressLine2}
          onChange={(e) => setFormData(prev => ({ ...prev, addressLine2: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter address line 2 (optional)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Publish Status
        </label>
        <select
          value={formData.publishStatus}
          onChange={(e) => setFormData(prev => ({ ...prev, publishStatus: e.target.value as 'published' | 'draft' }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Add Location
        </Button>
      </div>
    </form>
  );
}