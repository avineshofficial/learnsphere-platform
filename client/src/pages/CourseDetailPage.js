import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import ProgressBar from '../components/ProgressBar';
import Reviews from '../components/Reviews';
import Spinner from '../components/Spinner';
import { generateCertificate } from '../utils/generateCertificate';
import { getYouTubeEmbedUrl } from '../utils/videoHelper';
import './CourseDetailPage.css';

function CourseDetailPage() {
    const { id: courseId } = useParams(); 
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [activeLesson, setActiveLesson] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const courseRes = await api.get(`/courses/${courseId}`);
                setCourse(courseRes.data);
                if (courseRes.data.lessons && courseRes.data.lessons.length > 0) {
                    setActiveLesson(courseRes.data.lessons[0]);
                }
                if (user) {
                    const token = localStorage.getItem('token');
                    const config = { headers: { Authorization: `Bearer ${token}` } };
                    const enrolledRes = await api.get('/courses/my-courses', config);
                    setIsEnrolled(enrolledRes.data.some(c => c._id === courseId));
                    const progressRes = await api.get(`/users/progress`, config);
                    setCompletedLessons(progressRes.data.completedLessons || []);
                }
            } catch (error) {
                console.error("Failed to fetch course data", error);
                toast.error("Could not load course data.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [courseId, user]);
    
    const handleEnroll = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            await api.post(`/courses/${courseId}/enroll`, {}, { headers: { Authorization: `Bearer ${token}` }});
            setIsEnrolled(true);
            toast.success("Successfully enrolled!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Enrollment failed.");
        }
    };
    
    const handleMarkAsComplete = async () => {
        if (!isEnrolled) return toast.error("You must be enrolled to mark lessons complete.");
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const body = { courseId, lessonId: activeLesson._id };
            const { data } = await api.post('/users/progress', body, config);
            setCompletedLessons(data.completedLessons);
            toast.success(`'${activeLesson.title}' marked as complete!`);
        } catch (error) {
            toast.error("Could not update progress.");
        }
    };
    
    const isLessonCompleted = (lessonId) => completedLessons.includes(lessonId);

    const calculateProgress = () => {
        if (!course || !course.lessons || course.lessons.length === 0) return 0;
        const completedCount = course.lessons.filter(lesson => completedLessons.includes(lesson._id)).length;
        return (completedCount / course.lessons.length) * 100;
    };

    if (loading) return <Spinner />;
    if (!course) return <div>Course not found.</div>;

    const progress = calculateProgress();
    const embedUrl = activeLesson ? getYouTubeEmbedUrl(activeLesson.videoUrl) : null;

    return (
        <div className="course-detail-page">
            <div className="course-header">
                <h1>{course.title}</h1>
                <div className="course-description-full">
                {Array.isArray(course.description) ? (
                    course.description.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))
                ) : (
                    <p>{course.description}</p>
                )}
            </div>
                 {user && (
                    isEnrolled ? (
                        <button className="btn-enrolled" disabled>Already Enrolled</button>
                    ) : (
                        <button onClick={handleEnroll} className="btn-enroll">Enroll Now</button>
                    )
                )}
                {isEnrolled && progress === 100 && (
                    <button 
                        className="btn-certificate"
                        onClick={() => generateCertificate(user.name, course.title)}
                    >
                        Get Certificate
                    </button>
                )}
            </div>
            {isEnrolled ? (
                <>
                    <div className="progress-section">
                        <h3>Your Progress</h3>
                        <ProgressBar progress={progress} />
                    </div>
                    <div className="course-content-area">
                        <div className="lesson-list">
                            <h2>Lessons</h2>
                            <ul>
                                {course.lessons.map((lesson) => (
                                    <li 
                                        key={lesson._id} 
                                        className={`lesson-item ${activeLesson?._id === lesson._id ? 'active' : ''}`}
                                        onClick={() => setActiveLesson(lesson)}
                                    >
                                        {isLessonCompleted(lesson._id) ? '✅' : '🔘'} {lesson.title}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="course-main-content">
                            {activeLesson ? (
                                <>
                                    <h2>{activeLesson.title}</h2>
                                    
                                    {/* --- THIS IS THE CORRECTED VIDEO PLAYER SECTION --- */}
                                    <div className="video-player-wrapper">
                                        {embedUrl ? (
                                            <iframe
                                                src={embedUrl}
                                                title={activeLesson.title}
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        ) : (
                                            <div className="video-placeholder">
                                                <p>No video available for this lesson.</p>
                                            </div>
                                        )}
                                    </div>
                                    {/* --- END OF VIDEO PLAYER SECTION --- */}

                                    <button 
                                        onClick={handleMarkAsComplete}
                                        disabled={isLessonCompleted(activeLesson._id)}
                                        className="btn-mark-complete"
                                    >
                                        {isLessonCompleted(activeLesson._id) ? 'Completed' : 'Mark as Complete'}
                                    </button>
                                </>
                            ) : (
                                <p>Select a lesson to begin.</p>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <div className="enroll-prompt">
                    <h2>Enroll in this course to access the lessons.</h2>
                </div>
            )}
            <Reviews course={course} courseId={courseId} />
        </div>
    );
}

export default CourseDetailPage;