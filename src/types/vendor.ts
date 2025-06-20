export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  contactPerson: string;
  status: 'active' | 'inactive';
  registrationDate: string;
  website?: string;
}
