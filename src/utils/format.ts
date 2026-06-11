import type { CourseCategory, PickupType } from '../../shared/types';

export const categoryLabels: Record<CourseCategory, string> = {
  pottery: '陶艺',
  silver: '银饰',
  leather: '皮具',
};

export const categoryColors: Record<CourseCategory, string> = {
  pottery: 'bg-amber-100 text-amber-700',
  silver: 'bg-slate-100 text-slate-600',
  leather: 'bg-orange-100 text-orange-700',
};

export const pickupLabels: Record<PickupType, string> = {
  store: '到店领取',
  delivery: '快递配送',
};

export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const weekday = weekdays[date.getDay()];
  return `${month}月${day}日 ${weekday} ${hours}:${minutes}`;
}

export function formatDateRange(startIso: string, endIso: string): string {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const startHours = start.getHours().toString().padStart(2, '0');
  const startMinutes = start.getMinutes().toString().padStart(2, '0');
  const endHours = end.getHours().toString().padStart(2, '0');
  const endMinutes = end.getMinutes().toString().padStart(2, '0');
  const month = start.getMonth() + 1;
  const day = start.getDate();
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const weekday = weekdays[start.getDay()];
  return `${month}月${day}日 ${weekday} ${startHours}:${startMinutes}-${endHours}:${endMinutes}`;
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${month}月${day}日 ${hours}:${minutes}`;
}

export function getDaysUntil(isoString: string): number {
  const target = new Date(isoString);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function formatPrice(price: number): string {
  return `¥${price}`;
}

export function isValidPhone(phone: string): boolean {
  return /^1[3-9]\d{9}$/.test(phone);
}
