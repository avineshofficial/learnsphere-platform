import React from 'react';
import { Link } from 'react-router-dom';
import ProgressBar from './ProgressBar';
import Rating from './Rating';
import './CourseCard.css';

function CourseCard({ course, progress }) {
    // FIX: Use a reliable external placeholder if the thumbnail is a local path
    const thumbnailUrl = course.thumbnail?.startsWith('http') 
        ? course.thumbnail 
        : 'https://i.imgur.com/Gh3fKq2.png'; // A generic, reliable placeholder image

    return (
        <div className="course-card">
            <Link to={`/courses/${course._id}`} className="course-card-link">
                <img src={thumbnailUrl} alt={course.title} className="course-thumbnail" />
                <div className="course-content">
                    <h3 className="course-title">{course.title}</h3>
                    <div className="course-card-rating">
                        <Rating value={course.rating} text={`${course.numReviews} reviews`} />
                    </div>
                    <p className="course-description">{Array.isArray(course.description) ? course.description[0] : course.description}</p>
                    {progress !== undefined && (
                        <div className="course-card-progress">
                            <ProgressBar progress={progress} />
                        </div>
                    )}
                </div>
            </Link>
        </div>
    );
}

export default CourseCard;