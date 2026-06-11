import express, { type Request, type Response } from 'express';
import { dataStore } from '../store/dataStore.js';
import type { Enrollment } from '../../shared/types.js';

const router = express.Router();

router.post('/', (req: Request, res: Response) => {
  const body = req.body as Partial<Enrollment>;

  if (!body.courseId || !body.studentName || !body.studentPhone || !body.participantCount || !body.pickupType) {
    res.status(400).json({ success: false, error: '缺少必要的报名信息' });
    return;
  }

  if (body.participantCount < 1) {
    res.status(400).json({ success: false, error: '参与人数至少为 1 人' });
    return;
  }

  if (body.pickupType === 'delivery' && !body.deliveryAddress) {
    res.status(400).json({ success: false, error: '快递配送需要填写收货地址' });
    return;
  }

  const result = dataStore.createEnrollment({
    courseId: body.courseId,
    studentName: body.studentName,
    studentPhone: body.studentPhone,
    participantCount: body.participantCount,
    pickupType: body.pickupType,
    deliveryAddress: body.deliveryAddress,
    remark: body.remark,
  });

  if (!result.success) {
    res.status(400).json({ success: false, error: result.message });
    return;
  }

  res.json({ success: true, data: result.enrollment });
});

router.get('/student/:phone', (req: Request, res: Response) => {
  const enrollments = dataStore.getEnrollmentsByPhone(req.params.phone);
  const enrollmentsWithCourse = enrollments.map(e => ({
    ...e,
    course: dataStore.getCourse(e.courseId),
  }));
  res.json({ success: true, data: enrollmentsWithCourse });
});

router.get('/:id', (req: Request, res: Response) => {
  const enrollment = dataStore.getEnrollment(req.params.id);
  if (!enrollment) {
    res.status(404).json({ success: false, error: '报名记录不存在' });
    return;
  }
  const course = dataStore.getCourse(enrollment.courseId);
  res.json({ success: true, data: { ...enrollment, course } });
});

export default router;
