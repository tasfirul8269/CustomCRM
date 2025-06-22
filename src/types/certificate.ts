export interface Student {
  _id: string;
  name: string;
}

export interface Course {
  _id: string;
  title: string;
}

export interface Certificate {
  _id: string;
  student: string | Student; // ObjectId reference or populated object
  course: string | Course; // ObjectId reference or populated object
  issueDate: string;
  certificateNumber: string;
  status: 'pending' | 'issued' | 'dispatched';
  sentDate?: string;
  doorNumber?: string;
  createdAt: string;
  updatedAt: string;
}
