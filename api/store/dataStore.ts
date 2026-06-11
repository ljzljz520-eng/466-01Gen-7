import type { Course, Enrollment, Notification, CourseCategory } from '../../shared/types';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function formatDate(daysFromNow: number, hour = 10, minute = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

function addHours(isoDate: string, hours: number): string {
  const date = new Date(isoDate);
  date.setHours(date.getHours() + hours);
  return date.toISOString();
}

const now = new Date();

const initialCourses: Course[] = [
  {
    id: 'course-pottery-001',
    title: '手作陶艺：拉坯初体验',
    category: 'pottery' as CourseCategory,
    teacher: '李青瓷',
    description: '零基础也能轻松上手的陶艺入门课程。从揉泥、定中心到拉坯成型，全程一对一指导，完成作品可烧制后带回家。感受泥土在指尖旋转的治愈力量，创作专属于你的独一无二的陶艺作品。',
    materials: ['陶泥 500g', '修坯工具套装', '釉料（自选颜色）', '烧制服务'],
    coverImage: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80',
    price: 298,
    startTime: formatDate(5, 14, 0),
    endTime: addHours(formatDate(5, 14, 0), 3),
    location: '上海市静安区愚园路 128 号 2F',
    maxStudents: 8,
    totalKits: 10,
    remainingKits: 10,
    enrolledCount: 0,
    isPublished: true,
    createdAt: now.toISOString(),
  },
  {
    id: 'course-silver-001',
    title: '银饰手作：打造专属戒指',
    category: 'silver' as CourseCategory,
    teacher: '王银匠',
    description: '学习传统银饰工艺，从熔银、锻打、抛光到做旧，亲手打造一枚独一无二的纯银戒指。可刻字、选择纹理，成品即可带走。适合情侣对戒、闺蜜礼物或自我奖励。',
    materials: ['999 纯银 5g', '打金工具套装', '抛光材料', '戒指盒'],
    coverImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
    price: 398,
    startTime: formatDate(2, 10, 0),
    endTime: addHours(formatDate(2, 10, 0), 4),
    location: '上海市徐汇区武康路 376 号 B1',
    maxStudents: 6,
    totalKits: 3,
    remainingKits: 3,
    enrolledCount: 3,
    isPublished: true,
    createdAt: now.toISOString(),
  },
  {
    id: 'course-leather-001',
    title: '皮具工坊：手缝短夹钱包',
    category: 'leather' as CourseCategory,
    teacher: '陈皮匠',
    description: '选用意大利进口植鞣牛皮，学习裁皮、打孔、手缝、封边等经典皮具工艺。完成一款简约实用的短夹钱包，可使用多年且越用越有韵味。',
    materials: ['意大利植鞣牛皮 2 尺', '蜡线 2 色', '黄铜五金配件', '封边液'],
    coverImage: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80',
    price: 358,
    startTime: formatDate(7, 13, 30),
    endTime: addHours(formatDate(7, 13, 30), 4),
    location: '上海市黄浦区思南路 38 号 1F',
    maxStudents: 10,
    totalKits: 15,
    remainingKits: 15,
    enrolledCount: 0,
    isPublished: true,
    createdAt: now.toISOString(),
  },
];

const initialEnrollments: Enrollment[] = [
  {
    id: 'enroll-001',
    courseId: 'course-silver-001',
    studentName: '张小美',
    studentPhone: '13800138001',
    participantCount: 1,
    pickupType: 'store',
    remark: '希望能刻上名字首字母',
    createdAt: formatDate(-1, 15, 30),
  },
  {
    id: 'enroll-002',
    courseId: 'course-silver-001',
    studentName: '李大勇',
    studentPhone: '13900139002',
    participantCount: 2,
    pickupType: 'delivery',
    deliveryAddress: '上海市浦东新区陆家嘴环路 1000 号',
    remark: '情侣对戒，谢谢',
    createdAt: formatDate(-1, 16, 0),
  },
  {
    id: 'enroll-003',
    courseId: 'course-silver-001',
    studentName: '王小芳',
    studentPhone: '13700137003',
    participantCount: 1,
    pickupType: 'store',
    createdAt: formatDate(0, 9, 15),
  },
];

const initialNotifications: Notification[] = [
  {
    id: 'notif-001',
    courseId: 'course-silver-001',
    type: 'stock_warning',
    title: '⚠️ 材料库存预警',
    message: '「银饰手作：打造专属戒指」将在 2 天后开课，当前已报名 3 人，剩余材料包仅 3 份，库存不足 50%。建议及时补货或调整班级。',
    isRead: false,
    createdAt: formatDate(0, 8, 0),
  },
];

class DataStore {
  private courses: Course[] = [...initialCourses];
  private enrollments: Enrollment[] = [...initialEnrollments];
  private notifications: Notification[] = [...initialNotifications];

  getCourses(category?: CourseCategory | 'all', publishedOnly = true): Course[] {
    let result = [...this.courses];
    if (publishedOnly) {
      result = result.filter(c => c.isPublished);
    }
    if (category && category !== 'all') {
      result = result.filter(c => c.category === category);
    }
    return result.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }

  getCourse(id: string): Course | undefined {
    return this.courses.find(c => c.id === id);
  }

  createCourse(data: Omit<Course, 'id' | 'createdAt' | 'enrolledCount' | 'remainingKits'>): Course {
    const course: Course = {
      ...data,
      id: generateId(),
      remainingKits: data.totalKits,
      enrolledCount: 0,
      createdAt: new Date().toISOString(),
    };
    this.courses.push(course);
    return course;
  }

  updateCourse(id: string, data: Partial<Course>): Course | undefined {
    const index = this.courses.findIndex(c => c.id === id);
    if (index === -1) return undefined;
    this.courses[index] = { ...this.courses[index], ...data };
    return this.courses[index];
  }

  updateCourseStock(id: string, totalKits: number): Course | undefined {
    const course = this.getCourse(id);
    if (!course) return undefined;
    const usedKits = course.totalKits - course.remainingKits;
    const newRemaining = Math.max(0, totalKits - usedKits);
    return this.updateCourse(id, { totalKits, remainingKits: newRemaining });
  }

  getEnrollmentsByCourse(courseId: string): Enrollment[] {
    return this.enrollments
      .filter(e => e.courseId === courseId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getEnrollmentsByPhone(phone: string): Enrollment[] {
    return this.enrollments
      .filter(e => e.studentPhone === phone)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getEnrollment(id: string): Enrollment | undefined {
    return this.enrollments.find(e => e.id === id);
  }

  createEnrollment(data: Omit<Enrollment, 'id' | 'createdAt'>): { success: boolean; enrollment?: Enrollment; message?: string } {
    const course = this.getCourse(data.courseId);
    if (!course) {
      return { success: false, message: '课程不存在' };
    }

    if (course.remainingKits < data.participantCount) {
      return { success: false, message: `材料包库存不足，当前剩余 ${course.remainingKits} 份` };
    }

    if (course.enrolledCount + data.participantCount > course.maxStudents) {
      return { success: false, message: '报名人数已达上限' };
    }

    const enrollment: Enrollment = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    this.enrollments.push(enrollment);

    this.updateCourse(course.id, {
      remainingKits: course.remainingKits - data.participantCount,
      enrolledCount: course.enrolledCount + data.participantCount,
    });

    return { success: true, enrollment };
  }

  getNotifications(): Notification[] {
    return [...this.notifications].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getUnreadNotificationCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  markNotificationRead(id: string): Notification | undefined {
    const index = this.notifications.findIndex(n => n.id === id);
    if (index === -1) return undefined;
    this.notifications[index] = { ...this.notifications[index], isRead: true };
    return this.notifications[index];
  }

  checkStockAndNotify(): Notification[] {
    const now = new Date();
    const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const newNotifications: Notification[] = [];

    for (const course of this.courses) {
      if (!course.isPublished) continue;
      const courseStart = new Date(course.startTime);
      if (courseStart <= now) continue;
      if (courseStart > threeDaysLater) continue;

      const stockPercent = course.remainingKits / course.totalKits;
      const needsWarning = stockPercent < 0.5 || course.remainingKits <= 2;

      if (needsWarning) {
        const alreadyWarned = this.notifications.some(
          n => n.courseId === course.id && n.type === 'stock_warning'
        );
        if (!alreadyWarned) {
          const notification: Notification = {
            id: generateId(),
            courseId: course.id,
            type: 'stock_warning',
            title: '⚠️ 材料库存预警',
            message: `「${course.title}」即将开课，当前已报名 ${course.enrolledCount} 人，剩余材料包仅 ${course.remainingKits} 份。请及时补货或调整班级。`,
            isRead: false,
            createdAt: now.toISOString(),
          };
          this.notifications.push(notification);
          newNotifications.push(notification);
        }
      }
    }

    return newNotifications;
  }
}

export const dataStore = new DataStore();
