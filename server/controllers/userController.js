const User = require('../models/User');
const Course = require('../models/Course');

// @desc    Mark a lesson as complete
// @route   POST /api/users/progress
exports.markLessonAsComplete = async (req, res) => {
    // ... (no changes in this function)
    const { courseId, lessonId } = req.body;
    const userId = req.user.id;
    try {
        const user = await User.findById(userId);
        const course = await Course.findById(courseId);
        if (!user || !course) return res.status(404).json({ message: 'User or course not found.' });
        if (!user.enrolledCourses.includes(courseId)) return res.status(403).json({ message: 'User not enrolled in this course.' });
        if (!user.completedLessons.includes(lessonId)) {
            user.completedLessons.push(lessonId);
            await user.save();
        }
        res.status(200).json({ message: 'Lesson marked as complete.', completedLessons: user.completedLessons });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all of a user's progress
// @route   GET /api/users/progress
exports.getUserProgress = async (req, res) => {
    // ... (no changes in this function)
    const userId = req.user.id;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found.' });
        res.status(200).json({ completedLessons: user.completedLessons });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error'});
    }
};