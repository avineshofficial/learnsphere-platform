import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <Link to="/" style={{ fontSize: '1.2rem', color: 'var(--primary-color)' }}>
                Go to Homepage
            </Link>
        </div>
    );
};

export default NotFoundPage;