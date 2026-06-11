const API_BASE = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || '请求失败');
  }

  return data.data as T;
}

export const api = {
  getCourses: (category?: string) =>
    request(`/courses${category ? `?category=${category}` : ''}`),

  getCourse: (id: string) =>
    request(`/courses/${id}`),

  createCourse: (data: unknown) =>
    request('/courses', { method: 'POST', body: JSON.stringify(data) }),

  updateCourse: (id: string, data: unknown) =>
    request(`/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  updateCourseStock: (id: string, totalKits: number) =>
    request(`/courses/${id}/stock`, { method: 'PUT', body: JSON.stringify({ totalKits }) }),

  getCourseEnrollments: (id: string) =>
    request(`/courses/${id}/enrollments`),

  createEnrollment: (data: unknown) =>
    request('/enrollments', { method: 'POST', body: JSON.stringify(data) }),

  getStudentEnrollments: (phone: string) =>
    request(`/enrollments/student/${phone}`),

  getEnrollment: (id: string) =>
    request(`/enrollments/${id}`),

  getNotifications: () =>
    request('/notifications'),

  markNotificationRead: (id: string) =>
    request(`/notifications/${id}/read`, { method: 'PUT' }),

  checkStock: () =>
    request('/notifications/check-stock', { method: 'POST' }),
};
