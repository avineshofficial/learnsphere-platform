import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        navigate('/');
    };

    const closeMobileMenu = () => setMenuOpen(false);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
                    LearnSphere
                </Link>

                <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
                    <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
                </div>

                <ul className={menuOpen ? 'nav-menu active' : 'nav-menu'}>
                    {/* --- Standard Links --- */}
                    <li className="nav-item"><Link to="/" className="nav-links" onClick={closeMobileMenu}>Home</Link></li>
                    <li className="nav-item"><Link to="/courses" className="nav-links" onClick={closeMobileMenu}>Courses</Link></li>
                    
                    {user && (
                        <>
                            <li className="nav-item"><Link to="/mylearning" className="nav-links" onClick={closeMobileMenu}>My Learning</Link></li>
                            <li className="nav-item"><Link to="/profile" className="nav-links" onClick={closeMobileMenu}>Profile</Link></li>
                            {user.isAdmin && (
                                <li className="nav-item"><Link to="/admin/dashboard" className="nav-links" onClick={closeMobileMenu}>Admin</Link></li>
                            )}
                        </>
                    )}

                    {/* --- Authentication Buttons (Desktop vs Mobile) --- */}
                    {user ? (
                        <>
                            {/* Desktop Logout Button */}
                            <li className="nav-item-desktop">
                                <button onClick={handleLogout} className="nav-links-btn signup-btn">Logout</button>
                            </li>
                            {/* Mobile Logout Button */}
                            <li className="nav-item-mobile">
                                <button onClick={handleLogout} className="nav-links-btn signup-btn">Logout</button>
                            </li>
                        </>
                    ) : (
                        <>
                            {/* Desktop Login/Signup Buttons */}
                            <li className="nav-item-desktop">
                                <Link to="/login" className="nav-links-btn login-btn">Login</Link>
                            </li>
                            <li className="nav-item-desktop">
                                <Link to="/signup" className="nav-links-btn signup-btn">Sign Up</Link>
                            </li>

                            {/* Mobile Login/Signup Buttons */}
                            <li className="nav-item-mobile">
                                <Link to="/login" className="nav-links-btn login-btn" onClick={closeMobileMenu}>Login</Link>
                            </li>
                            <li className="nav-item-mobile">
                                <Link to="/signup" className="nav-links-btn signup-btn" onClick={closeMobileMenu}>Sign Up</Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;