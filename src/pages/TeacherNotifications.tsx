import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Calendar, Package, ChevronRight, Check as CheckIcon } from 'lucide-react';
import Header from '../components/Header';
import type { Notification, Course } from '../../shared/types';
import { api } from '../utils/api';
import { formatDate } from '../utils/format';
import { useAppStore } from '../store/appStore';

export default function TeacherNotifications() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { notifications, unreadCount, setNotifications, markNotificationRead } = useAppStore();

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      setLoading(true);
      const data = await api.getNotifications() as { notifications: Notification[]; unreadCount: number };
      setNotifications(data.notifications, data.unreadCount);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleClick(notif: Notification) {
    if (!notif.isRead) {
      try {
        await api.markNotificationRead(notif.id);
        markNotificationRead(notif.id);
      } catch (err) {
        console.error(err);
      }
    }
    navigate(`/teacher/course/${notif.courseId}`);
  }

  async function handleMarkAll() {
    for (const n of notifications) {
      if (!n.isRead) {
        try {
          await api.markNotificationRead(n.id);
          markNotificationRead(n.id);
        } catch (err) {
          console.error(err);
        }
      }
    }
  }

  return (
    <div className="min-h-screen">
      <Header showBack title="通知中心" />

      <div className="px-4 pt-4">
        {unreadCount > 0 && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-clay-500">您有 <span className="text-terracotta-500 font-bold">{unreadCount}</span> 条未读消息</p>
            <button
              onClick={handleMarkAll}
              className="flex items-center gap-1 text-sm text-terracotta-500 font-medium"
            >
              <CheckIcon size={14} />
              全部已读
            </button>
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="card p-4 animate-pulse">
                <div className="h-5 bg-clay-100 rounded w-2/3 mb-2" />
                <div className="h-4 bg-clay-100 rounded w-full" />
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-clay-100 flex items-center justify-center">
              <Calendar size={36} className="text-clay-300" />
            </div>
            <p className="text-clay-500 mb-2">暂无通知</p>
            <p className="text-xs text-clay-400">库存预警和开课提醒将在这里显示</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(notif => (
              <button
                key={notif.id}
                onClick={() => handleClick(notif)}
                className={`w-full card p-4 text-left active:scale-[0.99] transition-transform ${
                  !notif.isRead ? 'bg-terracotta-50/50 border border-terracotta-100' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    notif.type === 'stock_warning'
                      ? 'bg-terracotta-100'
                      : 'bg-forest-100'
                  }`}>
                    {notif.type === 'stock_warning' ? (
                      <AlertTriangle size={20} className="text-terracotta-500" />
                    ) : (
                      <Calendar size={20} className="text-forest-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-medium ${!notif.isRead ? 'text-ink' : 'text-clay-600'}`}>
                        {notif.title}
                      </h4>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-terracotta-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-clay-500 leading-relaxed mb-1.5 line-clamp-2">
                      {notif.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-clay-400">{formatDate(notif.createdAt)}</span>
                      <ChevronRight size={16} className="text-clay-300" />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {notifications.length > 0 && (
          <div className="mt-6 p-4 rounded-2xl bg-clay-50 border border-clay-100">
            <div className="flex items-start gap-2">
              <Package size={18} className="text-clay-500 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-clay-600 leading-relaxed">
                <p className="font-medium mb-1">库存预警规则</p>
                <ul className="space-y-0.5 text-clay-500">
                  <li>• 系统自动检查 3 天内即将开课的课程</li>
                  <li>• 剩余材料包不足 50% 或少于 3 份时触发预警</li>
                  <li>• 请及时补货或调整班级安排</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
