import React, { useState, useEffect } from 'react';
import api from '../services/api';
import CourseCard from '../components/CourseCard';
import Spinner from '../components/Spinner';
import './CoursesPage.css';

function CoursesPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(''); 
    const [inputText, setInputText] = useState(''); 
    

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`/courses`, {
                    params: { keyword: searchQuery } 
                });
                setCourses(data);
            } catch (error) {
                console.error("Failed to fetch courses:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [searchQuery]); 

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchQuery(inputText);
    };

    if (loading) return <Spinner />;

    return (
        <div className="courses-page">
            <h1>Explore Our Courses</h1>

            <form className="filter-controls" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search for courses..."
                    className="search-input"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)} 
                />
                
                <button type="submit" className="search-button">Search</button>
            </form>

            <div className="course-grid">
                {courses.length > 0 ? (
                    courses.map(course => (
                        <CourseCard key={course._id} course={course} />
                    ))
                ) : (
                    <p>No courses found matching your criteria.</p>
                )}
            </div>
        </div>
    );
}

export default CoursesPage;