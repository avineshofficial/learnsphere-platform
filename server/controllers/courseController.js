const Course = require('../models/Course');
const User = require('../models/User');

// --- PUBLIC ACCESS ---
exports.getAllCourses = async (req, res) => {
    try {
        const keyword = req.query.keyword ? { title: { $regex: req.query.keyword, $options: 'i' } } : {};
        const category = req.query.category ? { category: req.query.category } : {};
        const courses = await Course.find({ ...keyword, ...category });
        res.json(courses);
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (course) res.json(course);
        else res.status(404).json({ message: 'Course not found' });
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

// --- USER ACCESS (PROTECTED) ---
exports.getEnrolledCourses = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('enrolledCourses');
        res.json(user.enrolledCourses);
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

exports.enrollInCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        const user = await User.findById(req.user.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        if (user.enrolledCourses.includes(course._id)) return res.status(400).json({ message: 'User already enrolled' });
        user.enrolledCourses.push(course._id);
        await user.save();
        res.json({ message: 'Successfully enrolled' });
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

exports.createCourseReview = async (req, res) => {
    const { rating, comment } = req.body;
    try {
        const course = await Course.findById(req.params.id);
        if (course) {
            const alreadyReviewed = course.reviews.find(r => r.user.toString() === req.user._id.toString());
            if (alreadyReviewed) return res.status(400).json({ message: 'Course already reviewed' });
            const review = { name: req.user.name, rating: Number(rating), comment, user: req.user._id };
            course.reviews.push(review);
            course.numReviews = course.reviews.length;
            course.rating = course.reviews.reduce((acc, item) => item.rating + acc, 0) / course.reviews.length;
            await course.save();
            res.status(201).json({ message: 'Review added' });
        } else { res.status(404).json({ message: 'Course not found' }); }
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

// --- ADMIN ACCESS (PROTECTED + ADMIN) ---
exports.createCourse = async (req, res) => {
    try {
        const { title, description, category, thumbnail } = req.body;
        const course = new Course({ title, description, category, thumbnail, user: req.user._id });
        const createdCourse = await course.save();
        res.status(201).json(createdCourse);
    } catch (error) { res.status(400).json({ message: 'Invalid course data' }); }
};

exports.updateCourse = async (req, res) => {
    const { title, description, category, thumbnail } = req.body;
    const course = await Course.findById(req.params.id);
    if (course) {
        course.title = title || course.title;
        course.description = description || course.description;
        course.category = category || course.category;
        course.thumbnail = thumbnail || course.thumbnail;
        const updatedCourse = await course.save();
        res.json(updatedCourse);
    } else { res.status(404).json({ message: 'Course not found' }); }
};

exports.deleteCourse = async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (course) {
        await course.deleteOne();
        res.json({ message: 'Course removed' });
    } else { res.status(404).json({ message: 'Course not found' }); }
};

exports.addLesson = async (req, res) => {
    const { title, videoUrl } = req.body;
    const course = await Course.findById(req.params.id);
    if (course) {
        course.lessons.push({ title, videoUrl });
        await course.save();
        res.status(201).json({ message: 'Lesson added' });
    } else { res.status(404).json({ message: 'Course not found' }); }
};

exports.removeLesson = async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (course) {
        course.lessons = course.lessons.filter(lesson => lesson._id.toString() !== req.params.lessonId);
        await course.save();
        res.json({ message: 'Lesson removed' });
    } else { res.status(404).json({ message: 'Course not found' }); }
};