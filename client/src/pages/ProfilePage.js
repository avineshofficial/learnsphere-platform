import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './ProfilePage.css';

function ProfilePage() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await api.get('/users/profile', config);
                setProfile(data);
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchProfile();
        }
    }, [user]);

    if (loading) return <div className="loading">Loading Profile...</div>;
    if (!profile) return <div>Could not load profile information.</div>;

    return (
        <div className="profile-page">
            <div className="profile-card">
                <h1>My Profile</h1>
                <div className="profile-info">
                    <div className="info-item">
                        <strong>Name:</strong>
                        <span>{profile.name}</span>
                    </div>
                    <div className="info-item">
                        <strong>Email:</strong>
                        <span>{profile.email}</span>
                    </div>
                </div>
                {/* Future feature: <button>Edit Profile</button> */}
            </div>
        </div>
    );
}

export default ProfilePage;