import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, MapPin, User, Package, Store, Truck, CheckCircle2, AlertCircle } from 'lucide-react';
import Header from '../components/Header';
import type { Course, PickupType } from '../../shared/types';
import { api } from '../utils/api';
import { categoryLabels, categoryColors, formatDateRange, formatPrice, isValidPhone, pickupLabels } from '../utils/format';
import { useAppStore } from '../store/appStore';

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { triggerRefresh } = useAppStore();

  const [form, setForm] = useState({
    studentName: '',
    studentPhone: '',
    participantCount: 1,
    pickupType: 'store' as PickupType,
    deliveryAddress: '',
    remark: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id) loadCourse();
  }, [id]);

  async function loadCourse() {
    try {
      setLoading(true);
      const data = await api.getCourse(id!) as Course;
      setCourse(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!form.studentName.trim()) newErrors.studentName = '请输入姓名';
    if (!form.studentPhone.trim()) {
      newErrors.studentPhone = '请输入手机号';
    } else if (!isValidPhone(form.studentPhone)) {
      newErrors.studentPhone = '请输入正确的手机号';
    }
    if (form.participantCount < 1) newErrors.participantCount = '人数至少为1';
    if (form.pickupType === 'delivery' && !form.deliveryAddress.trim()) {
      newErrors.deliveryAddress = '请输入收货地址';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate() || !course) return;

    try {
      setSubmitting(true);
      await api.createEnrollment({
        courseId: course.id,
        ...form,
      });
      triggerRefresh();
      navigate(`/success/${course.id}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '报名失败';
      alert(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header showBack />
        <div className="animate-pulse">
          <div className="h-64 bg-clay-100" />
          <div className="p-4 space-y-4">
            <div className="h-8 bg-clay-100 rounded w-3/4" />
            <div className="h-4 bg-clay-100 rounded w-1/2" />
            <div className="h-4 bg-clay-100 rounded w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen">
        <Header showBack />
        <div className="p-8 text-center text-clay-500">课程不存在</div>
      </div>
    );
  }

  const isSoldOut = course.remainingKits <= 0;
  const isLowStock = course.remainingKits <= 3 && course.remainingKits > 0;

  return (
    <div className="min-h-screen pb-36">
      <Header showBack />

      <div className="relative">
        <img
          src={course.coverImage}
          alt={course.title}
          className="w-full h-64 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cream to-transparent" />
        <div className="absolute top-4 left-4">
          <span className={`tag ${categoryColors[course.category]} !py-1.5 !px-3.5 !text-sm`}>
            {categoryLabels[course.category]}
          </span>
        </div>
      </div>

      <div className="px-4 -mt-8 relative">
        <div className="card p-5">
          <h1 className="font-serif text-2xl font-bold text-ink mb-3">
            {course.title}
          </h1>

          <div className="space-y-2.5 mb-5">
            <div className="flex items-center gap-2 text-sm text-clay-600">
              <User size={16} className="text-clay-400" />
              <span>讲师：{course.teacher}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-clay-600">
              <Clock size={16} className="text-clay-400" />
              <span>{formatDateRange(course.startTime, course.endTime)}</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-clay-600">
              <MapPin size={16} className="text-clay-400 mt-0.5 flex-shrink-0" />
              <span>{course.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Package size={16} className={isLowStock ? 'text-terracotta-500' : 'text-clay-400'} />
              <span className={isSoldOut ? 'text-red-500 font-medium' : isLowStock ? 'text-terracotta-500 font-medium' : 'text-clay-600'}>
                {isSoldOut ? '材料包已售罄' : `材料包剩余 ${course.remainingKits}/${course.totalKits} 份`}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-clay-100">
            <div>
              <span className="font-serif text-3xl font-bold text-terracotta-500">
                {formatPrice(course.price)}
              </span>
              <span className="text-sm text-clay-400 ml-1">/人</span>
            </div>
            <div className="text-sm text-clay-500">
              已报名 {course.enrolledCount}/{course.maxStudents} 人
            </div>
          </div>
        </div>

        <div className="mt-5">
          <h3 className="section-title">课程介绍</h3>
          <div className="card p-4">
            <p className="text-sm leading-relaxed text-clay-700">
              {course.description}
            </p>
          </div>
        </div>

        <div className="mt-5">
          <h3 className="section-title flex items-center gap-2">
            <Package size={18} className="text-terracotta-500" />
            材料包清单
          </h3>
          <div className="card p-4">
            <ul className="space-y-2">
              {course.materials.map((mat, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-clay-700">
                  <CheckCircle2 size={16} className="text-forest-400 flex-shrink-0" />
                  {mat}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-5">
          <h3 className="section-title">报名信息</h3>
          <div className="card p-5 space-y-4">
            <div>
              <label className="label-text">姓名 <span className="text-terracotta-500">*</span></label>
              <input
                type="text"
                className="input-field"
                placeholder="请输入您的姓名"
                value={form.studentName}
                onChange={e => setForm({ ...form, studentName: e.target.value })}
              />
              {errors.studentName && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} />{errors.studentName}
                </p>
              )}
            </div>

            <div>
              <label className="label-text">手机号 <span className="text-terracotta-500">*</span></label>
              <input
                type="tel"
                className="input-field"
                placeholder="请输入手机号"
                maxLength={11}
                value={form.studentPhone}
                onChange={e => setForm({ ...form, studentPhone: e.target.value.replace(/\D/g, '') })}
              />
              {errors.studentPhone && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} />{errors.studentPhone}
                </p>
              )}
            </div>

            <div>
              <label className="label-text">参与人数 <span className="text-terracotta-500">*</span></label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="w-10 h-10 rounded-full bg-clay-100 text-clay-600 text-xl font-medium flex items-center justify-center"
                  onClick={() => setForm({ ...form, participantCount: Math.max(1, form.participantCount - 1) })}
                >
                  −
                </button>
                <span className="text-xl font-semibold text-ink w-8 text-center">
                  {form.participantCount}
                </span>
                <button
                  type="button"
                  className="w-10 h-10 rounded-full bg-clay-100 text-clay-600 text-xl font-medium flex items-center justify-center"
                  onClick={() => setForm({ ...form, participantCount: Math.min(course.maxStudents - course.enrolledCount, form.participantCount + 1) })}
                >
                  +
                </button>
                <span className="text-sm text-clay-400 ml-2">合计 {formatPrice(course.price * form.participantCount)}</span>
              </div>
            </div>

            <div>
              <label className="label-text">领取方式 <span className="text-terracotta-500">*</span></label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, pickupType: 'store' })}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    form.pickupType === 'store'
                      ? 'border-terracotta-400 bg-terracotta-50'
                      : 'border-clay-200 bg-white'
                  }`}
                >
                  <Store size={20} className={form.pickupType === 'store' ? 'text-terracotta-500' : 'text-clay-400'} />
                  <p className={`mt-1.5 text-sm font-medium ${form.pickupType === 'store' ? 'text-terracotta-600' : 'text-clay-600'}`}>
                    {pickupLabels.store}
                  </p>
                  <p className="text-xs text-clay-400 mt-0.5">上课时到店领取</p>
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, pickupType: 'delivery' })}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    form.pickupType === 'delivery'
                      ? 'border-terracotta-400 bg-terracotta-50'
                      : 'border-clay-200 bg-white'
                  }`}
                >
                  <Truck size={20} className={form.pickupType === 'delivery' ? 'text-terracotta-500' : 'text-clay-400'} />
                  <p className={`mt-1.5 text-sm font-medium ${form.pickupType === 'delivery' ? 'text-terracotta-600' : 'text-clay-600'}`}>
                    {pickupLabels.delivery}
                  </p>
                  <p className="text-xs text-clay-400 mt-0.5">开课前快递送达</p>
                </button>
              </div>
            </div>

            {form.pickupType === 'delivery' && (
              <div>
                <label className="label-text">收货地址 <span className="text-terracotta-500">*</span></label>
                <textarea
                  className="text-input"
                  rows={2}
                  placeholder="请输入详细收货地址"
                  value={form.deliveryAddress}
                  onChange={e => setForm({ ...form, deliveryAddress: e.target.value })}
                />
                {errors.deliveryAddress && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />{errors.deliveryAddress}
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="label-text">备注</label>
              <textarea
                className="text-input"
                rows={2}
                placeholder="选填，如有特殊需求请备注"
                value={form.remark}
                onChange={e => setForm({ ...form, remark: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 max-w-[480px] mx-auto bg-white border-t border-clay-100 p-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <p className="text-xs text-clay-400">合计</p>
            <p className="font-serif text-2xl font-bold text-terracotta-500">
              {formatPrice(course.price * form.participantCount)}
            </p>
          </div>
          <button
            className="btn-primary flex-1 ml-auto"
            disabled={submitting || isSoldOut}
            onClick={handleSubmit}
          >
            {submitting ? '提交中...' : isSoldOut ? '材料已售罄' : '立即报名'}
          </button>
        </div>
      </div>
    </div>
  );
}
