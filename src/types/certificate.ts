export interface Certificate {
  id: string;
  _id?: string;
  student: string; // ObjectId reference
  studentName?: string; // For display purposes
  course: string; // ObjectId reference
  courseName?: string; // For display purposes
  issueDate: string;
  certificateNumber: string;
  status: 'pending' | 'issued' | 'dispatched';
  sentDate?: string;
  doorNumber?: string;
  createdAt: string;
  updatedAt: string;
}
