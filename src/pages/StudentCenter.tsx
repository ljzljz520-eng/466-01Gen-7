import { useState, useEffect } from 'react';
import { Calendar, Store, Truck, Sparkles, User, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import type { EnrollmentWithCourse } from '../../shared/types';
import { api } from '../utils/api';
import { categoryLabels, categoryColors, formatDateTime, pickupLabels, isValidPhone, formatDate } from '../utils/format';
import { useAppStore } from '../store/appStore';

export default function StudentCenter() {
  const navigate = useNavigate();
  const { studentPhone, setStudentPhone, myEnrollments, setMyEnrollments } = useAppStore();
  const [inputPhone, setInputPhone] = useState(studentPhone);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(!!studentPhone);

  useEffect(() => {
    if (studentPhone) {
      loadEnrollments(studentPhone);
    }
  }, [studentPhone]);

  async function loadEnrollments(phone: string) {
    try {
      setLoading(true);
      const data = await api.getStudentEnrollments(phone) as EnrollmentWithCourse[];
      setMyEnrollments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch() {
    if (!isValidPhone(inputPhone)) {
      alert('请输入正确的手机号');
      return;
    }
    setStudentPhone(inputPhone);
    setSearched(true);
    loadEnrollments(inputPhone);
  }

  return (
    <div className="min-h-screen pb-24">
      <Header title="我的报名" />

      <div className="px-4 pt-4">
        <div className="card p-4 mb-5">
          <label className="label-text">查询报名记录</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-clay-400" />
              <input
                type="tel"
                className="input-field !pl-11"
                placeholder="请输入报名时的手机号"
                maxLength={11}
                value={inputPhone}
                onChange={e => setInputPhone(e.target.value.replace(/\D/g, ''))}
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-5 h-12 bg-ink text-white rounded-xl font-medium text-sm active:scale-[0.98] transition-transform flex items-center gap-1"
            >
              <Search size={16} />
              查询
            </button>
          </div>
          <p className="text-xs text-clay-400 mt-2">输入报名时使用的手机号即可查询所有报名记录</p>
        </div>

        {!searched ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-clay-100 flex items-center justify-center">
              <Calendar size={36} className="text-clay-300" />
            </div>
            <p className="text-clay-500">输入手机号查询报名记录</p>
          </div>
        ) : loading ? (
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="card p-4 animate-pulse">
                <div className="h-5 bg-clay-100 rounded w-2/3 mb-2" />
                <div className="h-4 bg-clay-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : myEnrollments.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-clay-100 flex items-center justify-center">
              <Sparkles size={36} className="text-clay-300" />
            </div>
            <p className="text-clay-500 mb-4">暂无报名记录</p>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-terracotta-400 text-white rounded-full text-sm font-medium shadow-button"
            >
              <Sparkles size={16} />
              去报名课程
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-clay-500 mb-2">共 {myEnrollments.length} 条报名记录</p>
            {myEnrollments.map(record => (
              <Link
                key={record.id}
                to={`/course/${record.courseId}`}
                className="card p-4 block active:scale-[0.99] transition-transform"
              >
                <div className="flex gap-3">
                  <img
                    src={record.course.coverImage}
                    alt={record.course.title}
                    className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-1">
                      <span className={`tag ${categoryColors[record.course.category]} !py-0.5`}>
                        {categoryLabels[record.course.category]}
                      </span>
                      <span className={`tag ${
                        record.pickupType === 'store' ? 'bg-forest-100 text-forest-500' : 'bg-sky-100 text-sky-600'
                      } !py-0.5 flex items-center gap-1`}>
                        {record.pickupType === 'store' ? <Store size={11} /> : <Truck size={11} />}
                        {pickupLabels[record.pickupType]}
                      </span>
                    </div>
                    <h4 className="font-medium text-ink text-sm line-clamp-1 mb-1">
                      {record.course.title}
                    </h4>
                    <p className="text-xs text-clay-500 mb-1">
                      {formatDateTime(record.course.startTime)}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-clay-400">
                        {record.participantCount}人 · 报名于 {formatDate(record.createdAt)}
                      </span>
                      <span className="text-sm font-semibold text-terracotta-500">
                        ¥{record.course.price * record.participantCount}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-[480px] mx-auto bg-white border-t border-clay-100">
        <div className="flex items-center justify-around h-16">
          <button
            onClick={() => navigate('/')}
            className="flex flex-col items-center gap-0.5 text-clay-400"
          >
            <Sparkles size={22} />
            <span className="text-xs font-medium">课程</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 text-terracotta-500">
            <Calendar size={22} />
            <span className="text-xs font-medium">我的</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
