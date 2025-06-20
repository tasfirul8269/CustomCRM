export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'graduated';
  courses: string[];
  totalPaid: number;
  // Extended fields
  address: string;
  city: string;
  postcode: string;
  gender: string;
  batchNo: string;
  vendor: string;
  bookedBy: string;
  courseType: string;
  assignmentStatus: 'pending' | 'complete';
  assignmentDate: string;
  note: string;
  admissionType: string;
  paymentSlots: string;
  courseFee: number;
  discount: number;
  received: number;
  refund: number;
  balanceDue: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  instructor: string;
  category: string;
  status: 'active' | 'inactive';
  enrolledStudents: number;
  maxCapacity: number;
  // Extended fields
  courseCode: string;
  assignmentDuration: number;
  published: boolean;
}

export interface Batch {
  id: string;
  name: string;
  courseId: string;
  courseName: string;
  startDate: string;
  endDate: string;
  instructor: string;
  students: number;
  maxCapacity: number;
  status: 'upcoming' | 'active' | 'completed';
  // Extended fields
  batchNo: string;
  publishedStatus: boolean;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  joinDate: string;
  salary: number;
  status: 'active' | 'inactive';
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  services: string[];
  contractValue: number;
  status: 'active' | 'inactive';
  // Extended fields
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
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  capacity: number;
  facilities: string[];
  status: 'active' | 'inactive';
  // Extended fields
  addressLine1: string;
  addressLine2: string;
  publishStatus: 'published' | 'draft';
}

export interface Certificate {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  issueDate: string;
  certificateNumber: string;
  status: 'pending' | 'issued' | 'dispatched';
  // Extended fields
  sentDate: string;
  doorNumber: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalCourses: number;
  totalRevenue: number;
  activeBatches: number;
  pendingCertificates: number;
  monthlyGrowth: number;
}