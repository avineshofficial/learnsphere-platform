import React from 'react';
import { Link } from 'react-router-dom';
import ProgressBar from './ProgressBar'; // Import it
import './CourseCard.css';
import Rating from './Rating';  

// Pass down progress as a prop
function CourseCard({ course, progress }) {
    return (
        <div className="course-card">
            <Link to={`/courses/${course._id}`} className="course-card-link">
                <img src={course.thumbnail} alt={course.title} className="course-thumbnail" />
                <div className="course-content">
                    <h3 className="course-title">{course.title}</h3>
                    <div className="course-card-rating">
                    <Rating value={course.rating} text={`${course.numReviews} reviews`} />
                </div>
                    <p className="course-description">{course.description}</p>
                    
                    {/* Conditionally render the progress bar if progress is provided */}
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