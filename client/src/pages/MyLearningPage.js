import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import CourseCard from '../components/CourseCard';
import '../pages/CoursesPage.css'; // Reuse styles
import './MyLearningPage.css';

function MyLearningPage() {
    const { user } = useAuth();
    const [inProgressCourses, setInProgressCourses] = useState([]);
    const [completedCourses, setCompletedCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLearningData = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                
                const [coursesRes, progressRes] = await Promise.all([
                    api.get('/courses/my-courses', config),
                    api.get('/users/progress', config)
                ]);

                const enrolledCourses = coursesRes.data;
                const completedLessons = progressRes.data.completedLessons || [];
                
                const categorizedCourses = enrolledCourses.map(course => {
                    if (!course.lessons || course.lessons.length === 0) {
                        return { ...course, progress: 0 };
                    }
                    const completedInCourse = course.lessons.filter(lesson => completedLessons.includes(lesson._id)).length;
                    const progress = (completedInCourse / course.lessons.length) * 100;
                    return { ...course, progress };
                });

                setInProgressCourses(categorizedCourses.filter(c => c.progress < 100));
                setCompletedCourses(categorizedCourses.filter(c => c.progress === 100));

            } catch (error) {
                console.error("Failed to fetch learning data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLearningData();
    }, [user]);

    if (loading) return <div className="loading">Loading your learning path...</div>;

    return (
        <div className="my-learning-page">
            <h1>My Learning</h1>
            
            <div className="learning-section">
                <h2>In Progress</h2>
                {inProgressCourses.length > 0 ? (
                    <div className="course-grid">
                        {inProgressCourses.map(course => (
                            <CourseCard key={course._id} course={course} progress={course.progress} />
                        ))}
                    </div>
                ) : (
                    <p>You have no courses in progress. <a href="/courses">Start a new course!</a></p>
                )}
            </div>

            <div className="learning-section">
                <h2>Completed</h2>
                {completedCourses.length > 0 ? (
                    <div className="course-grid">
                        {completedCourses.map(course => (
                            <CourseCard key={course._id} course={course} progress={course.progress} />
                        ))}
                    </div>
                ) : (
                    <p>You haven't completed any courses yet. Keep going!</p>
                )}
            </div>
        </div>
    );
}

export default MyLearningPage;