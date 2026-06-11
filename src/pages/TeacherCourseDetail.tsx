import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Package, Users, Store, Truck, Edit3, CheckCircle2, AlertTriangle } from 'lucide-react';
import Header from '../components/Header';
import type { Course, Enrollment } from '../../shared/types';
import { api } from '../utils/api';
import { categoryLabels, categoryColors, formatDateTime, formatPrice, pickupLabels, formatDate } from '../utils/format';
import { useAppStore } from '../store/appStore';

export default function TeacherCourseDetail() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStock, setEditingStock] = useState(false);
  const [newStock, setNewStock] = useState(0);
  const [savingStock, setSavingStock] = useState(false);
  const { triggerRefresh } = useAppStore();

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  async function loadData() {
    try {
      setLoading(true);
      const [courseData, enrollmentData] = await Promise.all([
        api.getCourse(id!) as Promise<Course>,
        api.getCourseEnrollments(id!) as Promise<Enrollment[]>,
      ]);
      setCourse(courseData);
      setEnrollments(enrollmentData);
      setNewStock(courseData.totalKits);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveStock() {
    if (!course) return;
    try {
      setSavingStock(true);
      const updated = await api.updateCourseStock(course.id, newStock) as Course;
      setCourse(updated);
      setEditingStock(false);
      triggerRefresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '保存失败';
      alert(msg);
    } finally {
      setSavingStock(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header showBack title="课程详情" />
        <div className="p-4 space-y-4 animate-pulse">
          <div className="card p-4 space-y-3">
            <div className="h-6 bg-clay-100 rounded w-2/3" />
            <div className="h-4 bg-clay-100 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen">
        <Header showBack title="课程详情" />
        <div className="p-8 text-center text-clay-500">课程不存在</div>
      </div>
    );
  }

  const isLowStock = course.remainingKits <= 3;
  const storePickups = enrollments.filter(e => e.pickupType === 'store').length;
  const deliveries = enrollments.filter(e => e.pickupType === 'delivery').length;

  return (
    <div className="min-h-screen pb-8">
      <Header showBack title="课程详情" />

      <div className="px-4 pt-4 space-y-5">
        <div className="card overflow-hidden">
          <img src={course.coverImage} alt={course.title} className="w-full h-40 object-cover" />
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className={`tag ${categoryColors[course.category]}`}>
                {categoryLabels[course.category]}
              </span>
              {isLowStock && (
                <span className="tag bg-red-100 text-red-600 animate-pulse-slow flex items-center gap-1">
                  <AlertTriangle size={12} />
                  库存不足
                </span>
              )}
            </div>
            <h1 className="font-serif text-xl font-bold text-ink mb-2">{course.title}</h1>
            <p className="text-sm text-clay-500 mb-1">讲师：{course.teacher}</p>
            <p className="text-sm text-clay-500 mb-1">{formatDateTime(course.startTime)}</p>
            <p className="text-sm text-clay-500">{course.location}</p>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="section-title !mb-0 flex items-center gap-2">
              <Package size={18} className="text-terracotta-500" />
              材料包库存
            </h3>
            {!editingStock && (
              <button
                onClick={() => setEditingStock(true)}
                className="flex items-center gap-1 text-sm text-terracotta-500 font-medium"
              >
                <Edit3 size={14} />
                调整
              </button>
            )}
          </div>

          {editingStock ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  className="input-field flex-1"
                  min={0}
                  value={newStock}
                  onChange={e => setNewStock(Number(e.target.value))}
                />
                <button
                  className="btn-primary !w-auto !px-5"
                  disabled={savingStock}
                  onClick={handleSaveStock}
                >
                  {savingStock ? '保存中' : '保存'}
                </button>
                <button
                  className="btn-secondary !w-auto !px-5"
                  onClick={() => {
                    setEditingStock(false);
                    setNewStock(course.totalKits);
                  }}
                >
                  取消
                </button>
              </div>
              <p className="text-xs text-clay-400">
                已使用 {course.totalKits - course.remainingKits} 份，调整后剩余库存将自动计算
              </p>
            </div>
          ) : (
            <>
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-clay-500">剩余库存</span>
                  <span className={isLowStock ? 'text-terracotta-500 font-bold' : 'font-medium text-ink'}>
                    {course.remainingKits} / {course.totalKits} 份
                  </span>
                </div>
                <div className="h-2.5 bg-clay-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isLowStock ? 'bg-terracotta-500 animate-pulse-slow' : 'bg-forest-400'
                    }`}
                    style={{ width: `${(course.remainingKits / course.totalKits) * 100}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-clay-100">
                <div className="text-center">
                  <p className="text-xs text-clay-400 mb-0.5">总库存</p>
                  <p className="font-semibold text-ink">{course.totalKits}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-clay-400 mb-0.5">已使用</p>
                  <p className="font-semibold text-ink">{course.totalKits - course.remainingKits}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-clay-400 mb-0.5">剩余</p>
                  <p className={`font-semibold ${isLowStock ? 'text-terracotta-500' : 'text-ink'}`}>
                    {course.remainingKits}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="card p-4">
          <h3 className="section-title flex items-center gap-2">
            <Users size={18} className="text-terracotta-500" />
            报名名单
            <span className="text-sm font-normal text-clay-400 ml-1">
              ({course.enrolledCount}/{course.maxStudents})
            </span>
          </h3>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-clay-50 rounded-xl p-3 flex items-center gap-2">
              <Store size={16} className="text-clay-500" />
              <div>
                <p className="text-xs text-clay-400">到店领取</p>
                <p className="font-semibold text-ink">{storePickups} 人</p>
              </div>
            </div>
            <div className="bg-clay-50 rounded-xl p-3 flex items-center gap-2">
              <Truck size={16} className="text-clay-500" />
              <div>
                <p className="text-xs text-clay-400">快递配送</p>
                <p className="font-semibold text-ink">{deliveries} 人</p>
              </div>
            </div>
          </div>

          {enrollments.length === 0 ? (
            <div className="text-center py-8">
              <Users size={32} className="mx-auto text-clay-200 mb-2" />
              <p className="text-sm text-clay-400">暂无报名学员</p>
            </div>
          ) : (
            <div className="space-y-3">
              {enrollments.map((enrollment, i) => (
                <div key={enrollment.id} className="bg-clay-50 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-terracotta-100 text-terracotta-500 text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="font-medium text-ink">{enrollment.studentName}</span>
                      <span className={`tag ${
                        enrollment.pickupType === 'store' ? 'bg-forest-100 text-forest-500' : 'bg-sky-100 text-sky-600'
                      } !py-0.5 !px-2`}>
                        {pickupLabels[enrollment.pickupType]}
                      </span>
                    </div>
                    <span className="text-xs text-clay-400">{formatDate(enrollment.createdAt)}</span>
                  </div>
                  <p className="text-xs text-clay-500 mb-1">📱 {enrollment.studentPhone}</p>
                  <p className="text-xs text-clay-500 mb-1">👥 {enrollment.participantCount} 人 · {formatPrice(course.price * enrollment.participantCount)}</p>
                  {enrollment.pickupType === 'delivery' && enrollment.deliveryAddress && (
                    <p className="text-xs text-clay-500">📍 {enrollment.deliveryAddress}</p>
                  )}
                  {enrollment.remark && (
                    <p className="text-xs text-terracotta-600 mt-1.5 pt-1.5 border-t border-clay-200/50">
                      💬 {enrollment.remark}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-4">
          <h3 className="section-title flex items-center gap-2">
            <CheckCircle2 size={18} className="text-forest-400" />
            材料清单
          </h3>
          <ul className="space-y-2">
            {course.materials.map((mat, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-clay-700">
                <CheckCircle2 size={15} className="text-forest-400 flex-shrink-0" />
                {mat}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
