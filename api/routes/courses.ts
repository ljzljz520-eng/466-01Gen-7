import express, { type Request, type Response } from 'express';
import { dataStore } from '../store/dataStore.js';
import type { Course, CourseCategory } from '../../shared/types.js';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  const category = req.query.category as CourseCategory | 'all' | undefined;
  const courses = dataStore.getCourses(category);
  res.json({ success: true, data: courses });
});

router.get('/:id', (req: Request, res: Response) => {
  const course = dataStore.getCourse(req.params.id);
  if (!course) {
    res.status(404).json({ success: false, error: '课程不存在' });
    return;
  }
  res.json({ success: true, data: course });
});

router.post('/', (req: Request, res: Response) => {
  const body = req.body as Partial<Course>;
  const requiredFields: (keyof Course)[] = [
    'title', 'category', 'teacher', 'description', 'materials',
    'coverImage', 'price', 'startTime', 'endTime', 'location',
    'maxStudents', 'totalKits',
  ];

  for (const field of requiredFields) {
    if (body[field] === undefined || body[field] === null) {
      res.status(400).json({ success: false, error: `缺少必要字段: ${field}` });
      return;
    }
  }

  const course = dataStore.createCourse({
    title: body.title!,
    category: body.category!,
    teacher: body.teacher!,
    description: body.description!,
    materials: body.materials!,
    coverImage: body.coverImage!,
    price: body.price!,
    startTime: body.startTime!,
    endTime: body.endTime!,
    location: body.location!,
    maxStudents: body.maxStudents!,
    totalKits: body.totalKits!,
    isPublished: body.isPublished ?? true,
  });

  res.json({ success: true, data: course });
});

router.put('/:id', (req: Request, res: Response) => {
  const course = dataStore.updateCourse(req.params.id, req.body);
  if (!course) {
    res.status(404).json({ success: false, error: '课程不存在' });
    return;
  }
  res.json({ success: true, data: course });
});

router.put('/:id/stock', (req: Request, res: Response) => {
  const { totalKits } = req.body as { totalKits: number };
  if (totalKits === undefined || totalKits < 0) {
    res.status(400).json({ success: false, error: '无效的库存数量' });
    return;
  }
  const course = dataStore.updateCourseStock(req.params.id, totalKits);
  if (!course) {
    res.status(404).json({ success: false, error: '课程不存在' });
    return;
  }
  res.json({ success: true, data: course });
});

router.get('/:id/enrollments', (req: Request, res: Response) => {
  const course = dataStore.getCourse(req.params.id);
  if (!course) {
    res.status(404).json({ success: false, error: '课程不存在' });
    return;
  }
  const enrollments = dataStore.getEnrollmentsByCourse(req.params.id);
  res.json({ success: true, data: enrollments });
});

export default router;
