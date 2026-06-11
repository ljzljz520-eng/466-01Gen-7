import { ChevronLeft, Bell, User as UserIcon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/appStore';

interface Props {
  title?: string;
  showBack?: boolean;
  showRight?: boolean;
}

export default function Header({ title, showBack = false, showRight = true }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, unreadCount, setRole } = useAppStore();

  const isTeacherPath = location.pathname.startsWith('/teacher');

  return (
    <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur-md border-b border-clay-100">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-2 w-20">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-full hover:bg-clay-100 transition-colors"
            >
              <ChevronLeft size={22} className="text-ink" />
            </button>
          )}
        </div>
        <h1 className="font-serif text-lg font-semibold text-ink flex-1 text-center">
          {title || (isTeacherPath ? '老师工作台' : '手作课程')}
        </h1>
        <div className="flex items-center gap-1 w-20 justify-end">
          {showRight && isTeacherPath && (
            <button
              onClick={() => navigate('/teacher/notifications')}
              className="relative p-2 -mr-2 rounded-full hover:bg-clay-100 transition-colors"
            >
              <Bell size={20} className="text-ink" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-terracotta-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          )}
          {showRight && !isTeacherPath && (
            <button
              onClick={() => {
                const newRole = role === 'student' ? 'teacher' : 'student';
                setRole(newRole);
                navigate(newRole === 'teacher' ? '/teacher' : '/');
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-clay-200"
            >
              <UserIcon size={14} className="text-clay-500" />
              <span className="text-xs text-clay-600 font-medium">
                {role === 'student' ? '学员' : '老师'}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
