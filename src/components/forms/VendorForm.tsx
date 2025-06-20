import React, { useState } from 'react';
import Button from '../ui/Button';
import { Upload } from 'lucide-react';

interface VendorFormData {
  logo: File | null;
  vendorName: string;
  fax: string;
  webAddress: string;
  addressLine1: string;
  addressLine2: string;
  registrationNumber: string;
  phone: string;
  email: string;
  invoicePrefix: string;
  published: boolean;
  approvedBy: string[];
  accountInfo: string;
}

interface VendorFormProps {
  onSubmit: (data: VendorFormData) => void;
  onCancel: () => void;
}

export default function VendorForm({ onSubmit, onCancel }: VendorFormProps) {
  const [formData, setFormData] = useState<VendorFormData>({
    logo: null,
    vendorName: '',
    fax: '',
    webAddress: '',
    addressLine1: '',
    addressLine2: '',
    registrationNumber: '',
    phone: '',
    email: '',
    invoicePrefix: '',
    published: true,
    approvedBy: [],
    accountInfo: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.vendorName.trim()) newErrors.vendorName = 'Vendor name is required';
    if (!formData.logo) newErrors.logo = 'Logo is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, logo: file }));
  };

  const handleApprovedByChange = (value: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({ ...prev, approvedBy: [...prev.approvedBy, value] }));
    } else {
      setFormData(prev => ({ ...prev, approvedBy: prev.approvedBy.filter(item => item !== value) }));
    }
  };

  const approvalOptions = ['City&Guilds', 'URILP', 'EDI', 'Edexcel', 'NOCN'];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Logo *
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
              id="logo-upload"
            />
            <label htmlFor="logo-upload" className="cursor-pointer">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                {formData.logo ? formData.logo.name : 'Click to upload logo'}
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </label>
          </div>
          {errors.logo && <p className="text-red-500 text-sm mt-1">{errors.logo}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vendor Name *
          </label>
          <input
            type="text"
            value={formData.vendorName}
            onChange={(e) => setFormData(prev => ({ ...prev, vendorName: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.vendorName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter vendor name"
          />
          {errors.vendorName && <p className="text-red-500 text-sm mt-1">{errors.vendorName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fax
          </label>
          <input
            type="text"
            value={formData.fax}
            onChange={(e) => setFormData(prev => ({ ...prev, fax: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter fax number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Web Address
          </label>
          <input
            type="url"
            value={formData.webAddress}
            onChange={(e) => setFormData(prev => ({ ...prev, webAddress: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address Line 1
          </label>
          <input
            type="text"
            value={formData.addressLine1}
            onChange={(e) => setFormData(prev => ({ ...prev, addressLine1: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter address line 1"
          />
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
            placeholder="Enter address line 2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Registration Number
          </label>
          <input
            type="text"
            value={formData.registrationNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, registrationNumber: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter registration number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter phone number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter email address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Invoice Prefix
          </label>
          <input
            type="text"
            value={formData.invoicePrefix}
            onChange={(e) => setFormData(prev => ({ ...prev, invoicePrefix: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., INV-"
          />
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Approved By
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {approvalOptions.map((option) => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.approvedBy.includes(option)}
                onChange={(e) => handleApprovedByChange(option, e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Account Info
        </label>
        <textarea
          value={formData.accountInfo}
          onChange={(e) => setFormData(prev => ({ ...prev, accountInfo: e.target.value }))}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter account information..."
        />
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Add Vendor
        </Button>
      </div>
    </form>
  );
}