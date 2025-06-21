export interface Batch {
  id: string;
  batchNo: string;
  subjectCourse: string;
  startingDate: string;
  endingDate: string;
  publishedStatus: boolean;
  status: 'upcoming' | 'active' | 'completed';
}
