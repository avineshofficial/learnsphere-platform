import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import '../AuthForm.css'; // Reuse styles
import './CourseEditPage.css'; // Add new specific styles

function CourseEditPage() {
    const { id: courseId } = useParams();
    const navigate = useNavigate();

    // Course details state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const [lessons, setLessons] = useState([]);
    
    // New lesson form state
    const [lessonTitle, setLessonTitle] = useState('');
    const [lessonVideoUrl, setLessonVideoUrl] = useState('');

    const [loading, setLoading] = useState(true);

    // Use a single fetch function to be able to recall it
    const fetchCourse = async () => {
        try {
            const { data } = await api.get(`/courses/${courseId}`);
            setTitle(data.title);
            setDescription(data.description);
            setCategory(data.category);
            setThumbnail(data.thumbnail);
            setLessons(data.lessons);
            setLoading(false);
        } catch (error) {
            toast.error('Could not fetch course details.');
            navigate('/admin/dashboard');
        }
    };

    useEffect(() => {
        fetchCourse();
    }, [courseId, navigate]);

    const handleCourseUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await api.put(`/courses/${courseId}`, { title, description, category, thumbnail }, config);
            toast.success('Course details updated!');
            // No navigation, stay on the page
        } catch (error) {
            toast.error('Failed to update course details.');
        }
    };
    
    const handleAddLesson = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await api.post(`/courses/${courseId}/lessons`, { title: lessonTitle, videoUrl: lessonVideoUrl }, config);
            toast.success('Lesson added!');
            setLessonTitle('');
            setLessonVideoUrl('');
            fetchCourse(); // Refresh the course data to show the new lesson
        } catch (error) {
            toast.error('Failed to add lesson.');
        }
    };

    const handleRemoveLesson = async (lessonId) => {
        if (window.confirm('Are you sure you want to remove this lesson?')) {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await api.delete(`/courses/${courseId}/lessons/${lessonId}`, config);
                toast.success('Lesson removed!');
                fetchCourse(); // Refresh the course data
            } catch (error) {
                toast.error('Failed to remove lesson.');
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="course-edit-page">
            <div className="edit-section">
                <form className="auth-form" onSubmit={handleCourseUpdate}>
                    <h2>Edit Course Details</h2>
                    {/* ... form inputs for title, description, etc. ... */}
                    <button type="submit" className="btn-submit">Update Course</button>
                </form>
            </div>
            
            <div className="edit-section">
                <div className="auth-form"> {/* Reuse styles for consistency */}
                    <h2>Manage Lessons</h2>
                    <ul className="lesson-management-list">
                        {lessons.map(lesson => (
                            <li key={lesson._id}>
                                <span>{lesson.title}</span>
                                <button onClick={() => handleRemoveLesson(lesson._id)} className="btn-remove-lesson">Remove</button>
                            </li>
                        ))}
                    </ul>
                    <hr />
                    <form onSubmit={handleAddLesson}>
                        <h3>Add New Lesson</h3>
                        <div className="form-group">
                            <label>Lesson Title</label>
                            <input type="text" value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Video URL (Optional)</label>
                            <input type="text" value={lessonVideoUrl} onChange={(e) => setLessonVideoUrl(e.target.value)} />
                        </div>
                        <button type="submit" className="btn-submit">Add Lesson</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CourseEditPage;