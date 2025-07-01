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
  bookedBy?: string;
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
  paymentPlan?: { date: string; amount: number; received: number }[];
  resit?: {
    batch: string;
    status: string; // 'yes' or 'no'
  };
}

export interface Course {
  id: string;
  title: string;
  courseCode: string;
  assignmentDuration: number;
  status: 'active' | 'inactive';
}

export interface Batch {
  id: string;
  _id?: string;
  name: string;
  courseId: string;
  courseName: string;
  startDate: string;
  endDate: string;
  startingDate: string;
  endingDate: string;
  instructor: string;
  students: number;
  maxCapacity: number;
  status: 'upcoming' | 'active' | 'completed';
  // Extended fields
  batchNo: string;
  subjectCourse: string;
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
  locationName: string;
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