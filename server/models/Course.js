// server/models/Course.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
}, { timestamps: true });

const LessonSchema = new Schema({
    title: { type: String, required: true },
    videoUrl: { type: String },
    content: { type: String },
});

const CourseSchema = new Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    thumbnail: { type: String, default: 'default.jpg' },
    category: { type: String, required: true },
    lessons: [LessonSchema],
    reviews: [reviewSchema], // ADD THIS
    rating: { // ADD THIS for average rating
        type: Number,
        required: true,
        default: 0
    },
    numReviews: { // ADD THIS for number of reviews
        type: Number,
        required: true,
        default: 0
    },
    lessons: [LessonSchema]
});

module.exports = mongoose.model('Course', CourseSchema);