export interface Certificate {
  id: string;
  certificateNumber: string;
  studentName: string;
  course: string;
  issueDate: string;
  expiryDate?: string;
  status: 'issued' | 'pending' | 'dispatched' | 'delivered';
  dispatchDate?: string;
  deliveryMethod: 'email' | 'post' | 'download';
  recipientEmail?: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
