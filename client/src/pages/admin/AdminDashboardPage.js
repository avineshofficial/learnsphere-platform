import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Spinner from '../../components/Spinner';
import './AdminDashboardPage.css'; // <-- Critical CSS import

function AdminDashboardPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { data } = await api.get('/courses');
                setCourses(data);
            } catch (error) { toast.error('Could not fetch courses.'); }
            finally { setLoading(false); }
        };
        fetchCourses();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await api.delete(`/courses/${id}`, config);
                toast.success('Course deleted successfully');
                setCourses(courses.filter((course) => course._id !== id));
            } catch (error) {
                toast.error('Failed to delete course.');
            }
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard - Manage Courses</h1>
            <Link to="/admin/course/create" className="btn-create">Create New Course</Link>
            {courses.length > 0 ? (
                <table>
                    <thead><tr><th>ID</th><th>Title</th><th>Category</th><th>Actions</th></tr></thead>
                    <tbody>
                        {courses.map(course => (
                            <tr key={course._id}>
                                <td>{course._id}</td><td>{course.title}</td><td>{course.category}</td>
                                <td>
                                    <Link to={`/admin/course/${course._id}/edit`} className="btn-edit">Edit</Link>
                                    <button onClick={() => handleDelete(course._id)} className="btn-delete">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p style={{ marginTop: '2rem' }}>No courses found. Click "Create New Course" to add one.</p>
            )}
        </div>
    );
}

export default AdminDashboardPage;