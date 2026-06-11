export type CourseCategory = 'pottery' | 'silver' | 'leather';

export type PickupType = 'store' | 'delivery';

export type NotificationType = 'stock_warning' | 'course_reminder';

export interface Course {
  id: string;
  title: string;
  category: CourseCategory;
  teacher: string;
  description: string;
  materials: string[];
  coverImage: string;
  price: number;
  startTime: string;
  endTime: string;
  location: string;
  maxStudents: number;
  totalKits: number;
  remainingKits: number;
  enrolledCount: number;
  isPublished: boolean;
  createdAt: string;
}

export interface Enrollment {
  id: string;
  courseId: string;
  studentName: string;
  studentPhone: string;
  participantCount: number;
  pickupType: PickupType;
  deliveryAddress?: string;
  remark?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  courseId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface EnrollmentWithCourse extends Enrollment {
  course: Course;
}

export type UserRole = 'student' | 'teacher';
