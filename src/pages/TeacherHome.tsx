import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Package, Users, Calendar, AlertTriangle, LayoutGrid } from 'lucide-react';
import Header from '../components/Header';
import type { Course, Notification } from '../../shared/types';
import { api } from '../utils/api';
import { categoryLabels, categoryColors, formatDateTime, formatPrice } from '../utils/format';
import { useAppStore } from '../store/appStore';

export default function TeacherHome() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { setNotifications, unreadCount, setRole, triggerRefresh, refreshKey } = useAppStore();

  useEffect(() => {
    loadData();
  }, [refreshKey]);

  async function loadData() {
    try {
      setLoading(true);
      const [coursesData, notifData] = await Promise.all([
        api.getCourses() as Promise<Course[]>,
        api.getNotifications() as Promise<{ notifications: Notification[]; unreadCount: number }>,
      ]);
      setCourses(coursesData);
      setNotifications(notifData.notifications, notifData.unreadCount);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const totalEnrollments = courses.reduce((sum, c) => sum + c.enrolledCount, 0);
  const lowStockCourses = courses.filter(c => c.remainingKits <= 3);

  return (
    <div className="min-h-screen pb-24">
      <Header />

      <div className="px-4 pt-4">
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-xl bg-terracotta-100 flex items-center justify-center">
                <LayoutGrid size={18} className="text-terracotta-500" />
              </div>
              <span className="text-sm text-clay-500">课程总数</span>
            </div>
            <p className="font-serif text-3xl font-bold text-ink">{courses.length}</p>
          </div>
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-xl bg-forest-100 flex items-center justify-center">
                <Users size={18} className="text-forest-400" />
              </div>
              <span className="text-sm text-clay-500">报名人数</span>
            </div>
            <p className="font-serif text-3xl font-bold text-ink">{totalEnrollments}</p>
          </div>
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-xl bg-clay-100 flex items-center justify-center">
                <Package size={18} className="text-clay-500" />
              </div>
              <span className="text-sm text-clay-500">材料库存</span>
            </div>
            <p className="font-serif text-3xl font-bold text-ink">
              {courses.reduce((sum, c) => sum + c.remainingKits, 0)}
            </p>
          </div>
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-xl bg-terracotta-100 flex items-center justify-center">
                <AlertTriangle size={18} className="text-terracotta-500" />
              </div>
              <span className="text-sm text-clay-500">库存预警</span>
            </div>
            <p className={`font-serif text-3xl font-bold ${lowStockCourses.length > 0 ? 'text-terracotta-500' : 'text-ink'}`}>
              {lowStockCourses.length}
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={() => navigate('/teacher/notifications')}
            className="w-full card p-4 mb-5 bg-terracotta-50 border border-terracotta-200 flex items-center gap-3 active:scale-[0.99] transition-transform"
          >
            <div className="w-10 h-10 rounded-full bg-terracotta-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={20} className="text-terracotta-500" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-terracotta-600">您有 {unreadCount} 条未读通知</p>
              <p className="text-xs text-terracotta-400">点击查看材料库存预警</p>
            </div>
          </button>
        )}

        <div className="flex items-center justify-between mb-3">
          <h3 className="section-title !mb-0 flex items-center gap-2">
            <Calendar size={18} className="text-terracotta-500" />
            我的课程
          </h3>
          <button
            onClick={() => navigate('/teacher/create')}
            className="flex items-center gap-1 px-4 py-2 bg-ink text-white rounded-full text-sm font-medium active:scale-[0.98] transition-transform"
          >
            <Plus size={16} />
            发布课程
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="card p-4 animate-pulse">
                <div className="h-5 bg-clay-100 rounded w-2/3 mb-2" />
                <div className="h-4 bg-clay-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="card p-10 text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-clay-100 flex items-center justify-center">
              <Calendar size={28} className="text-clay-300" />
            </div>
            <p className="text-clay-500 text-sm mb-4">还没有发布课程</p>
            <button
              onClick={() => navigate('/teacher/create')}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-terracotta-400 text-white rounded-full text-sm font-medium shadow-button"
            >
              <Plus size={16} />
              立即发布
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {courses.map(course => {
              const isLowStock = course.remainingKits <= 3;
              return (
                <Link
                  key={course.id}
                  to={`/teacher/course/${course.id}`}
                  className="card p-4 block active:scale-[0.99] transition-transform"
                >
                  <div className="flex gap-3">
                    <img
                      src={course.coverImage}
                      alt={course.title}
                      className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-1">
                        <span className={`tag ${categoryColors[course.category]} !py-0.5`}>
                          {categoryLabels[course.category]}
                        </span>
                        {isLowStock && (
                          <span className="tag bg-red-100 text-red-600 !py-0.5 animate-pulse-slow">
                            库存不足
                          </span>
                        )}
                      </div>
                      <h4 className="font-medium text-ink text-sm line-clamp-1 mb-1">{course.title}</h4>
                      <p className="text-xs text-clay-500 mb-1.5">{formatDateTime(course.startTime)}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-terracotta-500">{formatPrice(course.price)}</span>
                        <div className="flex items-center gap-3 text-xs text-clay-500">
                          <span className="flex items-center gap-1">
                            <Users size={12} />
                            {course.enrolledCount}/{course.maxStudents}
                          </span>
                          <span className="flex items-center gap-1">
                            <Package size={12} />
                            <span className={isLowStock ? 'text-red-500 font-medium' : ''}>
                              {course.remainingKits}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-[480px] mx-auto bg-white border-t border-clay-100">
        <div className="flex items-center justify-around h-16">
          <button className="flex flex-col items-center gap-0.5 text-terracotta-500">
            <LayoutGrid size={22} />
            <span className="text-xs font-medium">工作台</span>
          </button>
          <button
            onClick={() => navigate('/teacher/notifications')}
            className="relative flex flex-col items-center gap-0.5 text-clay-400"
          >
            <AlertTriangle size={22} />
            <span className="text-xs font-medium">通知</span>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1/4 min-w-[16px] h-[16px] px-1 bg-terracotta-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              setRole('student');
              navigate('/');
            }}
            className="flex flex-col items-center gap-0.5 text-clay-400"
          >
            <Calendar size={22} />
            <span className="text-xs font-medium">学员端</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
