export interface Batch {
  id: string;
  name: string;
  course: string;
  startDate: string;
  endDate: string;
  schedule: string;
  location: string;
  instructor: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled' | 'draft';
  maxStudents: number;
  currentStudents: number;
  createdAt: string;
  updatedAt: string;
}
