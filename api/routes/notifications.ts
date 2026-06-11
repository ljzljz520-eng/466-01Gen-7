import express, { type Request, type Response } from 'express';
import { dataStore } from '../store/dataStore.js';

const router = express.Router();

router.get('/', (_req: Request, res: Response) => {
  const notifications = dataStore.getNotifications();
  const unreadCount = dataStore.getUnreadNotificationCount();
  res.json({ success: true, data: { notifications, unreadCount } });
});

router.put('/:id/read', (req: Request, res: Response) => {
  const notification = dataStore.markNotificationRead(req.params.id);
  if (!notification) {
    res.status(404).json({ success: false, error: '通知不存在' });
    return;
  }
  res.json({ success: true, data: notification });
});

router.post('/check-stock', (_req: Request, res: Response) => {
  const newNotifications = dataStore.checkStockAndNotify();
  res.json({ success: true, data: { generated: newNotifications.length, notifications: newNotifications } });
});

export default router;
