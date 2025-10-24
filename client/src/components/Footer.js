import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h4>LearnSphere</h4>
                    <p>Empowering minds through accessible online education.</p>
                </div>
                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/courses">Courses</Link></li>
                        {/* FIX: Changed Dashboard to My Learning */}
                        <li><Link to="/mylearning">My Learning</Link></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Contact Us</h4>
                    <p>Email: contact@learnsphere.com</p>
                </div>
            </div>
            <div className="footer-bottom">
                {/* FIX: Made the year dynamic */}
                <p>&copy; {new Date().getFullYear()} LearnSphere. All Rights Reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;