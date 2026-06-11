import { useState, useEffect } from 'react';
import { Sparkles, Calendar } from 'lucide-react';
import Header from '../components/Header';
import CategoryTabs from '../components/CategoryTabs';
import CourseCard from '../components/CourseCard';
import type { Course, CourseCategory } from '../../shared/types';
import { api } from '../utils/api';
import { useAppStore } from '../store/appStore';

export default function Home() {
  const [category, setCategory] = useState<CourseCategory | 'all'>('all');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { refreshKey } = useAppStore();

  useEffect(() => {
    loadCourses();
  }, [category, refreshKey]);

  async function loadCourses() {
    try {
      setLoading(true);
      const data = await api.getCourses(category) as Course[];
      setCourses(data);
    } catch (err) {
      console.error('加载课程失败', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen pb-24">
      <Header />

      <div className="px-4 pt-4">
        <div className="relative rounded-3xl bg-gradient-to-br from-terracotta-400 via-terracotta-500 to-terracotta-600 p-5 text-white overflow-hidden mb-6">
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
          <div className="absolute -right-4 bottom-0 w-24 h-24 rounded-full bg-white/5" />
          <div className="relative">
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles size={18} />
              <span className="text-sm font-medium opacity-90">发现手作之美</span>
            </div>
            <h2 className="font-serif text-2xl font-bold mb-1">今日精选课程</h2>
            <p className="text-sm opacity-80">用双手创造独一无二的温暖</p>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="section-title !mb-0 flex items-center gap-2">
              <Calendar size={18} className="text-terracotta-500" />
              全部课程
            </h3>
          </div>
          <CategoryTabs active={category} onChange={setCategory} />
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="card animate-pulse">
                <div className="h-44 bg-clay-100" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-clay-100 rounded w-3/4" />
                  <div className="h-4 bg-clay-100 rounded w-1/2" />
                  <div className="h-4 bg-clay-100 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-clay-100 flex items-center justify-center">
              <Sparkles size={32} className="text-clay-300" />
            </div>
            <p className="text-clay-500">暂无相关课程</p>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-[480px] mx-auto bg-white border-t border-clay-100">
        <div className="flex items-center justify-around h-16">
          <button className="flex flex-col items-center gap-0.5 text-terracotta-500">
            <Sparkles size={22} />
            <span className="text-xs font-medium">课程</span>
          </button>
          <button
            onClick={() => window.location.href = '/student'}
            className="flex flex-col items-center gap-0.5 text-clay-400"
          >
            <Calendar size={22} />
            <span className="text-xs font-medium">我的</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
