import React, { useState, useEffect } from 'react';
import api from '../services/api';
import CourseCard from '../components/CourseCard';
import './CoursesPage.css';

function CoursesPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    // State to hold the final search query
    const [searchQuery, setSearchQuery] = useState(''); 
    // State to hold the text in the input box
    const [inputText, setInputText] = useState(''); 
    const [category, setCategory] = useState('');

    const categories = ["Web Development", "Web Design", "Data Science", "Marketing"];

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`/courses`, {
                    // Use the final searchQuery state here
                    params: { keyword: searchQuery, category: category } 
                });
                setCourses(data);
            } catch (error) {
                console.error("Failed to fetch courses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
        // Effect now runs only when searchQuery or category changes
    }, [searchQuery, category]); 

    // This function is called when the form is submitted
    const handleSearch = (e) => {
        e.preventDefault(); // Prevent page refresh
        setSearchQuery(inputText); // Set the final search query
    };

    if (loading) return <div className="loading">Loading courses...</div>;

    return (
        <div className="courses-page">
            <h1>Explore Our Courses</h1>

            <form className="filter-controls" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search for courses..."
                    className="search-input"
                    value={inputText}
                    // Update the input text state as the user types
                    onChange={(e) => setInputText(e.target.value)} 
                />
                <select 
                    className="category-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
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