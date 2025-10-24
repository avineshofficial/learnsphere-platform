import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Reviews.css';
import Rating from './Rating';

function Reviews({ course, courseId }) {
    const { user } = useAuth();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await api.post(`/courses/${courseId}/reviews`, { rating, comment }, config);
            toast.success("Review submitted! Thank you.");
            // In a real app, you'd refresh the reviews here
            window.location.reload(); // Simple refresh for now
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit review.");
        }
    };

    return (
        <div className="reviews-section">
            <h2>Reviews</h2>
            {course.reviews.length === 0 && <p>No reviews yet.</p>}
            <ul className="review-list">
                {course.reviews.map((review) => (
                    <li key={review._id} className="review-item">
                        <strong>{review.name}</strong>
                        {/* REPLACE text rating with the component */}
                        <Rating value={review.rating} /> 
                        <p>{review.comment}</p>
                    </li>
                ))}
            </ul>

            {user && (
                <div className="review-form">
                    <h3>Write a Customer Review</h3>
                    <form onSubmit={submitHandler}>
                        <div className="form-group">
                            <label>Rating</label>
                            <select value={rating} onChange={(e) => setRating(e.target.value)}>
                                <option value="">Select...</option>
                                <option value="1">1 - Poor</option>
                                <option value="2">2 - Fair</option>
                                <option value="3">3 - Good</option>
                                <option value="4">4 - Very Good</option>
                                <option value="5">5 - Excellent</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Comment</label>
                            <textarea rows="3" value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
                        </div>
                        <button type="submit" className="btn-submit">Submit</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Reviews;