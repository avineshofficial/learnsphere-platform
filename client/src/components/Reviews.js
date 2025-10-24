import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Rating from './Rating'; // We will use our existing Rating component for display
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import './Reviews.css';

function Reviews({ course, courseId, isEnrolled }) {
    const { user } = useAuth();
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0); // For the interactive star hover effect
    const [comment, setComment] = useState('');

    const submitHandler = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            return toast.error('Please select a rating.');
        }
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await api.post(`/courses/${courseId}/reviews`, { rating, comment }, config);
            toast.success("Review submitted! Thank you.");
            window.location.reload(); // Simple refresh to show the new review
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit review.");
        }
    };

    const userHasReviewed = course.reviews.find(r => r.user === user?._id);

    return (
        <div className="reviews-container">
            <h2>Reviews & Ratings</h2>
            <div className="reviews-layout">
                {/* --- Column 1: List of Existing Reviews --- */}
                <div className="reviews-list-section">
                    {course.reviews.length === 0 && <p>Be the first to review this course!</p>}
                    <ul className="review-list">
                        {course.reviews.map((review) => (
                            <li key={review._id} className="review-item">
                                <div className="review-header">
                                    <strong>{review.name}</strong>
                                    <Rating value={review.rating} />
                                </div>
                                <p className="review-comment">{review.comment}</p>
                                <p className="review-date">
                                    Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* --- Column 2: The "Write a Review" Form --- */}
                <div className="review-form-section">
                    <h3>Write a Review</h3>
                    {!user ? (
                        <p>Please <Link to="/login">log in</Link> to write a review.</p>
                    ) : !isEnrolled ? (
                        <p>You must be enrolled in this course to write a review.</p>
                    ) : userHasReviewed ? (
                        <p>You have already reviewed this course.</p>
                    ) : (
                        <form onSubmit={submitHandler}>
                            <div className="form-group">
                                <label>Your Rating</label>
                                <div className="star-rating-input">
                                    {[...Array(5)].map((star, index) => {
                                        const ratingValue = index + 1;
                                        return (
                                            <label key={index}>
                                                <input
                                                    type="radio"
                                                    name="rating"
                                                    value={ratingValue}
                                                    onClick={() => setRating(ratingValue)}
                                                />
                                                <FontAwesomeIcon
                                                    className="star-icon"
                                                    icon={faStar}
                                                    color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                                                    onMouseEnter={() => setHover(ratingValue)}
                                                    onMouseLeave={() => setHover(0)}
                                                />
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="comment">Your Comment</label>
                                <textarea
                                    id="comment"
                                    rows="5"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className="btn-submit">Submit Review</button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Reviews;