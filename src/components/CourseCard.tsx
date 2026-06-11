import { Clock, MapPin, User, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Course } from '../../shared/types';
import { categoryLabels, categoryColors, formatDateRange, formatPrice, getDaysUntil } from '../utils/format';

interface Props {
  course: Course;
}

export default function CourseCard({ course }: Props) {
  const daysUntil = getDaysUntil(course.startTime);
  const isLowStock = course.remainingKits <= 3;
  const isAlmostFull = course.enrolledCount >= course.maxStudents - 2;

  return (
    <Link to={`/course/${course.id}`} className="card block active:scale-[0.99] transition-transform">
      <div className="relative">
        <img
          src={course.coverImage}
          alt={course.title}
          className="w-full h-44 object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className={`tag ${categoryColors[course.category]}`}>
            {categoryLabels[course.category]}
          </span>
        </div>
        {daysUntil <= 3 && daysUntil > 0 && (
          <div className="absolute top-3 right-3">
            <span className="tag bg-terracotta-100 text-terracotta-500">
              {daysUntil}天后开课
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-serif text-lg font-semibold text-ink mb-2 line-clamp-1">
          {course.title}
        </h3>
        <div className="flex items-center gap-1 text-sm text-clay-500 mb-1.5">
          <User size={14} />
          <span>{course.teacher}</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-clay-500 mb-1.5">
          <Clock size={14} />
          <span>{formatDateRange(course.startTime, course.endTime)}</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-clay-500 mb-3">
          <MapPin size={14} />
          <span className="line-clamp-1">{course.location}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-serif text-xl font-semibold text-terracotta-500">
            {formatPrice(course.price)}
            <span className="text-xs text-clay-400 font-normal ml-1">/人</span>
          </span>
          <div className="flex items-center gap-1">
            <Package size={14} className={isLowStock ? 'text-red-500 animate-pulse-slow' : 'text-clay-400'} />
            <span className={`text-sm ${isLowStock ? 'text-red-500 font-medium' : 'text-clay-500'}`}>
              {isAlmostFull ? (
                <span className="text-terracotta-500 font-medium">即将满员</span>
              ) : (
                `剩${course.remainingKits}份材料`
              )}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
