export interface Vendor {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  services: string[];
  contractValue: number;
  status: 'active' | 'inactive';
  logo: string;
  fax: string;
  webAddress: string;
  addressLine1: string;
  addressLine2: string;
  registrationNumber: string;
  invoicePrefix: string;
  published: boolean;
  approvedBy: string[];
  accountInfo: string;
  createdAt: string;
  updatedAt: string;
} 