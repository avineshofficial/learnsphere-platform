import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import '../AuthForm.css'; // Reuse styles from auth forms

function CourseCreatePage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            // Send the form data to the back-end
            await api.post('/courses', { title, description, category, thumbnail }, config);
            toast.success('Course created successfully!');
            // Redirect back to the dashboard after successful creation
            navigate('/admin/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create course.');
        }
    };

    return (
        <div className="auth-form-container">
            <form className="auth-form" onSubmit={submitHandler}>
                <h2>Create New Course</h2>
                <div className="form-group">
                    <label>Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Category</label>
                    <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Thumbnail Image URL</label>
                    <input type="text" value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} />
                </div>
                <button type="submit" className="btn-submit">Create Course</button>
            </form>
        </div>
    );
}

export default CourseCreatePage;