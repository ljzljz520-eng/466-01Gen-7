import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Home, Calendar, Store, Truck, MapPin, User } from 'lucide-react';
import Header from '../components/Header';
import type { Course, Enrollment } from '../../shared/types';
import { api } from '../utils/api';
import { formatDateRange, formatPrice, pickupLabels } from '../utils/format';

export default function EnrollSuccess() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [course, setCourse] = useState<Course | null>(null);
  const enrollment = (location.state as { enrollment?: Enrollment })?.enrollment;

  useEffect(() => {
    if (id) loadCourse();
  }, [id]);

  async function loadCourse() {
    try {
      const data = await api.getCourse(id!) as Course;
      setCourse(data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen">
      <Header showBack showRight={false} />

      <div className="px-4 pt-6">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-forest-100 flex items-center justify-center">
            <CheckCircle size={48} className="text-forest-400" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-ink mb-2">报名成功！</h1>
          <p className="text-clay-500 text-sm">我们期待与您相见</p>
        </div>

        {course && (
          <div className="card p-5 mb-6">
            <div className="flex gap-4 mb-4">
              <img
                src={course.coverImage}
                alt={course.title}
                className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-base font-semibold text-ink mb-1.5 line-clamp-2">
                  {course.title}
                </h3>
                <div className="flex items-center gap-1 text-sm text-clay-500 mb-1">
                  <Calendar size={14} />
                  <span className="text-xs">{formatDateRange(course.startTime, course.endTime)}</span>
                </div>
                <p className="font-serif text-lg font-bold text-terracotta-500">
                  {formatPrice(course.price)}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-clay-100 space-y-3">
              {enrollment && (
                <>
                  <div className="flex items-center gap-2 text-sm">
                    <User size={16} className="text-clay-400" />
                    <span className="text-clay-500">学员姓名：</span>
                    <span className="text-ink font-medium">{enrollment.studentName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <User size={16} className="text-clay-400" />
                    <span className="text-clay-500">参与人数：</span>
                    <span className="text-ink font-medium">{enrollment.participantCount} 人</span>
                  </div>
                </>
              )}
              <div className="flex items-center gap-2 text-sm">
                {enrollment?.pickupType === 'store' ? <Store size={16} className="text-clay-400" /> : <Truck size={16} className="text-clay-400" />}
                <span className="text-clay-500">领取方式：</span>
                <span className="text-ink font-medium">
                  {enrollment ? pickupLabels[enrollment.pickupType] : pickupLabels.store}
                </span>
              </div>
              {enrollment?.pickupType === 'delivery' && enrollment.deliveryAddress && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin size={16} className="text-clay-400 mt-0.5" />
                  <span className="text-clay-500">收货地址：</span>
                  <span className="text-ink">{enrollment.deliveryAddress}</span>
                </div>
              )}
              {(!enrollment || enrollment.pickupType === 'store') && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin size={16} className="text-clay-400 mt-0.5" />
                  <span className="text-clay-500">上课地点：</span>
                  <span className="text-ink">{course.location}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-clay-50 rounded-2xl p-4 mb-8">
          <h4 className="text-sm font-medium text-ink mb-2">温馨提示</h4>
          <ul className="space-y-1.5 text-xs text-clay-600 leading-relaxed">
            <li>• 请准时到达课程地点，建议提前 10 分钟到场</li>
            <li>• 如选择快递配送，材料包将于开课前 2 天寄出</li>
            <li>• 如需取消请提前 48 小时联系老师</li>
          </ul>
        </div>

        <div className="space-y-3">
          <button className="btn-primary" onClick={() => navigate('/')}>
            <Home size={18} className="inline mr-2" />
            返回首页
          </button>
          <button className="btn-secondary" onClick={() => navigate('/student')}>
            查看我的报名
          </button>
        </div>
      </div>
    </div>
  );
}
