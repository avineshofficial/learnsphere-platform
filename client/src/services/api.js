// client/src/services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'; // Your backend URL

const api = axios.create({
    baseURL: API_URL,
});

// Example function to get all courses
export const getCourses = () => api.get('/courses');

// Example function for user login
export const loginUser = (credentials) => api.post('/auth/login', credentials);

export default api;