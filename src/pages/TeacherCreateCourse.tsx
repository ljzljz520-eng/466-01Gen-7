import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import type { CourseCategory } from '../../shared/types';
import { api } from '../utils/api';
import { categoryLabels } from '../utils/format';
import { useAppStore } from '../store/appStore';

const categoryOptions: { key: CourseCategory; label: string }[] = [
  { key: 'pottery', label: '陶艺' },
  { key: 'silver', label: '银饰' },
  { key: 'leather', label: '皮具' },
];

const defaultImages: Record<CourseCategory, string> = {
  pottery: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80',
  silver: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
  leather: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80',
};

export default function TeacherCreateCourse() {
  const navigate = useNavigate();
  const { triggerRefresh } = useAppStore();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    category: 'pottery' as CourseCategory,
    teacher: '',
    description: '',
    materials: '',
    price: 298,
    startTime: '',
    duration: 3,
    location: '',
    maxStudents: 8,
    totalKits: 10,
  });

  function handleChange<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    if (!form.title.trim()) return alert('请输入课程名称');
    if (!form.teacher.trim()) return alert('请输入讲师姓名');
    if (!form.description.trim()) return alert('请输入课程介绍');
    if (!form.materials.trim()) return alert('请输入材料清单');
    if (!form.startTime) return alert('请选择开课时间');
    if (!form.location.trim()) return alert('请输入上课地点');

    const startDate = new Date(form.startTime);
    const endDate = new Date(startDate.getTime() + form.duration * 60 * 60 * 1000);

    try {
      setSubmitting(true);
      await api.createCourse({
        title: form.title,
        category: form.category,
        teacher: form.teacher,
        description: form.description,
        materials: form.materials.split(/[,，\n]/).map(m => m.trim()).filter(Boolean),
        coverImage: defaultImages[form.category],
        price: form.price,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        location: form.location,
        maxStudents: form.maxStudents,
        totalKits: form.totalKits,
        isPublished: true,
      });
      triggerRefresh();
      navigate('/teacher');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '发布失败';
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen pb-24">
      <Header title="发布新课程" showBack />

      <div className="px-4 pt-4 space-y-5">
        <div className="card p-5 space-y-4">
          <div>
            <label className="label-text">课程分类 <span className="text-terracotta-500">*</span></label>
            <div className="grid grid-cols-3 gap-2">
              {categoryOptions.map(opt => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => handleChange('category', opt.key)}
                  className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                    form.category === opt.key
                      ? 'bg-ink text-white'
                      : 'bg-clay-50 text-clay-600 border border-clay-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label-text">课程名称 <span className="text-terracotta-500">*</span></label>
            <input
              type="text"
              className="input-field"
              placeholder="例如：手作陶艺：拉坯初体验"
              value={form.title}
              onChange={e => handleChange('title', e.target.value)}
            />
          </div>

          <div>
            <label className="label-text">讲师姓名 <span className="text-terracotta-500">*</span></label>
            <input
              type="text"
              className="input-field"
              placeholder="请输入您的姓名"
              value={form.teacher}
              onChange={e => handleChange('teacher', e.target.value)}
            />
          </div>

          <div>
            <label className="label-text">课程介绍 <span className="text-terracotta-500">*</span></label>
            <textarea
              className="text-input"
              rows={4}
              placeholder="介绍一下课程内容、适合人群等"
              value={form.description}
              onChange={e => handleChange('description', e.target.value)}
            />
          </div>

          <div>
            <label className="label-text">材料包清单 <span className="text-terracotta-500">*</span></label>
            <textarea
              className="text-input"
              rows={3}
              placeholder="每行一项，用逗号或换行分隔"
              value={form.materials}
              onChange={e => handleChange('materials', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-text">课程价格（元） <span className="text-terracotta-500">*</span></label>
              <input
                type="number"
                className="input-field"
                min={0}
                value={form.price}
                onChange={e => handleChange('price', Number(e.target.value))}
              />
            </div>
            <div>
              <label className="label-text">课时时长（小时）</label>
              <input
                type="number"
                className="input-field"
                min={1}
                value={form.duration}
                onChange={e => handleChange('duration', Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label className="label-text">开课时间 <span className="text-terracotta-500">*</span></label>
            <input
              type="datetime-local"
              className="input-field"
              value={form.startTime}
              onChange={e => handleChange('startTime', e.target.value)}
            />
          </div>

          <div>
            <label className="label-text">上课地点 <span className="text-terracotta-500">*</span></label>
            <input
              type="text"
              className="input-field"
              placeholder="请输入详细地址"
              value={form.location}
              onChange={e => handleChange('location', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-text">最大人数</label>
              <input
                type="number"
                className="input-field"
                min={1}
                value={form.maxStudents}
                onChange={e => handleChange('maxStudents', Number(e.target.value))}
              />
            </div>
            <div>
              <label className="label-text">材料包数量 <span className="text-terracotta-500">*</span></label>
              <input
                type="number"
                className="input-field"
                min={0}
                value={form.totalKits}
                onChange={e => handleChange('totalKits', Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 max-w-[480px] mx-auto bg-white border-t border-clay-100 p-4">
        <div className="flex gap-3">
          <button className="btn-secondary flex-1" onClick={() => navigate(-1)}>
            取消
          </button>
          <button
            className="btn-primary flex-1"
            disabled={submitting}
            onClick={handleSubmit}
          >
            {submitting ? '发布中...' : '发布课程'}
          </button>
        </div>
      </div>
    </div>
  );
}
