const express = require('express');
const router = express.Router();
const { 
    getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse, 
    getEnrolledCourses, enrollInCourse, createCourseReview, addLesson, removeLesson 
} = require('../controllers/courseController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getAllCourses).post(protect, admin, createCourse);
router.get('/my-courses', protect, getEnrolledCourses);
router.route('/:id').get(getCourseById).put(protect, admin, updateCourse).delete(protect, admin, deleteCourse);
router.post('/:id/enroll', protect, enrollInCourse);
router.post('/:id/reviews', protect, createCourseReview);
router.post('/:id/lessons', protect, admin, addLesson);
router.delete('/:id/lessons/:lessonId', protect, admin, removeLesson);

module.exports = router;
