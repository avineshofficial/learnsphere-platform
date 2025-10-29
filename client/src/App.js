import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Core Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminRoute from './components/AdminRoute';
import Chatbot from './components/Chatbot';

// Page Components
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MyLearningPage from './pages/MyLearningPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Admin Page Components
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import CourseCreatePage from './pages/admin/CourseCreatePage';
import CourseEditPage from './pages/admin/CourseEditPage';

import './App.css';

function App() {
    return (
        <Router>
            <Toaster position="top-center" reverseOrder={false} />
            <Navbar />
            <main className="container">
                <Routes>
                    {/* --- Public & User Routes --- */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/courses" element={<CoursesPage />} />
                    <Route path="/courses/:id" element={<CourseDetailPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/mylearning" element={<MyLearningPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    
                    {/* --- Admin Routes (Protected) --- */}
                    <Route path="/admin" element={<AdminRoute />}>
                        <Route path="dashboard" element={<AdminDashboardPage />} />
                        <Route path="course/create" element={<CourseCreatePage />} />
                        <Route path="course/:id/edit" element={<CourseEditPage />} />
                    </Route>

                    {/* --- Catch-all 404 Route --- */}
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </main>
            <Footer />
            <Chatbot /> 
        </Router>
    );
}

// The invalid export line has been removed. The default export is below.
export default App;