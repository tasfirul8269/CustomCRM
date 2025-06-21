export type Position = 'Manager' | 'Supervisor' | 'Staff';
export type Status = 'Live' | 'Inactive';

export interface Employee {
  id: string;
  _id?: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  addressLine1: string;
  addressLine2?: string;
  position: Position;
  status: Status;
  dateOfBirth: string;
  licenseNumber: string;
  joiningDate: string;
  leavingDate?: string;
  contactNumber?: string;
  gender: string;
  employeeVendor?: string;
  note: string;
  photo?: string; // URL to uploaded photo
  signature?: string; // URL to uploaded signature
  createdAt: string;
  updatedAt: string;
}
