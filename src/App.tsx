import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import CourseDetail from '@/pages/CourseDetail';
import EnrollSuccess from '@/pages/EnrollSuccess';
import TeacherHome from '@/pages/TeacherHome';
import TeacherCreateCourse from '@/pages/TeacherCreateCourse';
import TeacherCourseDetail from '@/pages/TeacherCourseDetail';
import TeacherNotifications from '@/pages/TeacherNotifications';
import StudentCenter from '@/pages/StudentCenter';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course/:id" element={<CourseDetail />} />
        <Route path="/success/:id" element={<EnrollSuccess />} />
        <Route path="/teacher" element={<TeacherHome />} />
        <Route path="/teacher/create" element={<TeacherCreateCourse />} />
        <Route path="/teacher/course/:id" element={<TeacherCourseDetail />} />
        <Route path="/teacher/notifications" element={<TeacherNotifications />} />
        <Route path="/student" element={<StudentCenter />} />
      </Routes>
    </Router>
  );
}
