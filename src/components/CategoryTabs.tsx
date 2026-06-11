import type { CourseCategory } from '../../shared/types';

interface Props {
  active: CourseCategory | 'all';
  onChange: (category: CourseCategory | 'all') => void;
}

const categories: { key: CourseCategory | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'pottery', label: '陶艺' },
  { key: 'silver', label: '银饰' },
  { key: 'leather', label: '皮具' },
];

export default function CategoryTabs({ active, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
      {categories.map((cat) => {
        const isActive = active === cat.key;
        return (
          <button
            key={cat.key}
            onClick={() => onChange(cat.key)}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              isActive
                ? 'bg-ink text-white shadow-md'
                : 'bg-white text-clay-600 border border-clay-200'
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
