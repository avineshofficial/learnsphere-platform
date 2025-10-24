import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import CourseCard from '../components/CourseCard';
import Spinner from '../components/Spinner';
import './HomePage.css';
import './CoursesPage.css';

function HomePage() {
    const [featuredCourses, setFeaturedCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { data } = await api.get('/courses');
                setFeaturedCourses(data.slice(0, 3));
            } catch (error) {
                console.error("Could not fetch featured courses", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    return (
        <div className="home-page">
            <section className="hero">
                <div className="hero-content">
                    <h1 className="hero-title">Unlock Your Potential</h1>
                    <p className="hero-subtitle">Find the perfect course to boost your skills and career.</p>
                    <Link to="/courses" className="hero-button">
                        Browse Courses
                    </Link>
                </div>
            </section>

            <section className="featured-courses">
                <h2>Featured Courses</h2>
                {loading ? (
                    <Spinner />
                ) : (
                    <div className="course-grid">
                        {featuredCourses.map(course => (
                            <CourseCard key={course._id} course={course} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default HomePage;