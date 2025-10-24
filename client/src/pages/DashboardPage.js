import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import CourseCard from '../components/CourseCard';
import './CoursesPage.css';

function DashboardPage() {
    const { user } = useAuth();
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                
                // Fetch both enrolled courses and progress in parallel
                const [coursesRes, progressRes] = await Promise.all([
                    api.get('/courses/my-courses', config),
                    // CORRECT: Calling the fixed route '/api/users/progress'
                    api.get('/users/progress', config) 
                ]);

                setEnrolledCourses(coursesRes.data);
                setCompletedLessons(progressRes.data.completedLessons || []);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [user]);

    const calculateProgress = (course) => {
        if (!course.lessons || course.lessons.length === 0) return 0;
        
        const completedInCourse = course.lessons.filter(lesson => completedLessons.includes(lesson._id)).length;
        return (completedInCourse / course.lessons.length) * 100;
    };

    if (loading) return <div className="loading">Loading your dashboard...</div>;

    return (
        <div className="courses-page">
            <h1>My Dashboard</h1>
            <h2>Welcome back, {user?.name}!</h2>

            {enrolledCourses.length > 0 ? (
                <>
                    <h3>Your Enrolled Courses</h3>
                    <div className="course-grid">
                        {enrolledCourses.map(course => (
                            <CourseCard 
                                key={course._id} 
                                course={course} 
                                progress={calculateProgress(course)} 
                            />
                        ))}
                    </div>
                </>
            ) : (
                <p>You haven't enrolled in any courses yet. <a href="/courses">Explore courses</a>!</p>
            )}
        </div>
    );
}

export default DashboardPage;