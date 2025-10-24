import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
    // 1. Get the current user object and logout function from our global AuthContext.
    // 'user' will be null if not logged in, or an object { name, email, isAdmin, ... } if logged in.
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // 2. Define the logout handler function.
    const handleLogout = () => {
        logout(); // This clears user data from context and local storage.
        navigate('/'); // Redirect the user to the homepage.
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    LearnSphere
                </Link>
                <ul className="nav-menu">
                    {/* These links are visible to everyone */}
                    <li className="nav-item">
                        <Link to="/" className="nav-links">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/courses" className="nav-links">Courses</Link>
                    </li>

                    {/* 3. Check if a user object exists. This is our main conditional rendering block. */}
                    {user ? (
                        // If 'user' exists, render the links for a logged-in user.
                        <>
                            <li className="nav-item">
                                <Link to="/mylearning" className="nav-links">My Learning</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/profile" className="nav-links">Profile</Link>
                            </li>
                            
                            {/* 4. IMPORTANT: Conditionally render the Admin link.
                                This checks if the user object EXISTS AND has the isAdmin property set to true.
                                If `user.isAdmin` is false or undefined, this will correctly render nothing.
                            */}
                            {user.isAdmin && (
                                <li className="nav-item">
                                    <Link to="/admin/dashboard" className="nav-links">Admin</Link>
                                </li>
                            )}

                            <li className="nav-item">
                                <button onClick={handleLogout} className="nav-links-btn signup-btn">Logout</button>
                            </li>
                        </>
                    ) : (
                        // If 'user' is null, render the links for a logged-out user.
                        <>
                            <li className="nav-item">
                                <Link to="/login" className="nav-links-btn login-btn">Login</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/signup" className="nav-links-btn signup-btn">Sign Up</Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;