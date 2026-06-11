import { create } from 'zustand';
import type { UserRole, Course, Notification, EnrollmentWithCourse } from '../../shared/types';

interface AppState {
  role: UserRole;
  setRole: (role: UserRole) => void;
  studentPhone: string;
  setStudentPhone: (phone: string) => void;
  myEnrollments: EnrollmentWithCourse[];
  setMyEnrollments: (enrollments: EnrollmentWithCourse[]) => void;
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (notifications: Notification[], unreadCount: number) => void;
  markNotificationRead: (id: string) => void;
  refreshKey: number;
  triggerRefresh: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  role: 'student',
  setRole: (role) => set({ role }),
  studentPhone: '',
  setStudentPhone: (phone) => set({ studentPhone: phone }),
  myEnrollments: [],
  setMyEnrollments: (enrollments) => set({ myEnrollments: enrollments }),
  notifications: [],
  unreadCount: 0,
  setNotifications: (notifications, unreadCount) => set({ notifications, unreadCount }),
  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map(n =>
      n.id === id ? { ...n, isRead: true } : n
    ),
    unreadCount: Math.max(0, state.unreadCount - 1),
  })),
  refreshKey: 0,
  triggerRefresh: () => set((state) => ({ refreshKey: state.refreshKey + 1 })),
}));
