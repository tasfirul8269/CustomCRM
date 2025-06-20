export type Position = 'Manager' | 'Supervisor' | 'Staff';
export type Status = 'Live' | 'Inactive';

export interface Employee {
  id: string;
  photo: File | null;
  email: string;
  mobileNumber: string;
  addressLine1: string;
  position?: Position;
  status?: Status;
  fullName: string;
  dateOfBirth: string;
  licenseNumber: string;
  addressLine2?: string;
  joiningDate: string;
  leavingDate?: string;
  signature: File | null;
  contactNumber?: string;
  gender: string;
  employeeVendor?: string;
  note: string;
  createdAt: string;
  updatedAt: string;
}
