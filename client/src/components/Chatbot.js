import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faPaperPlane, faTimes } from '@fortawesome/free-solid-svg-icons';
import './Chatbot.css';

function Chatbot() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hello! I am the LearnSphere Assistant. How can I help you today?' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const userMessageText = inputValue.trim();
        if (!userMessageText) return;

        // Add user message to the chat window immediately
        setMessages(prev => [...prev, { sender: 'user', text: userMessageText }]);
        setInputValue('');
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            // --- THIS IS THE SIMPLIFIED API CALL for Gemini ---
            // We only need to send the user's prompt.
            const { data } = await api.post('/chatbot/generate', { 
                prompt: userMessageText 
            }, config);
            
            setMessages(prev => [...prev, { sender: 'bot', text: data.response }]);
        } catch (error) {
            toast.error(error.response?.data?.message || "Sorry, I'm having trouble connecting.");
            // Roll back the user's message if the API call fails
            setMessages(prev => prev.slice(0, prev.length - 1));
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return null;
    }

    // The JSX for the chat window is unchanged and correct.
    return (
        <div className="chatbot-container">
            {isOpen ? (
                <div className="chat-window">
                    <div className="chat-header">
                        <h3>LearnSphere Assistant</h3>
                        <button onClick={() => setIsOpen(false)} className="close-chat-btn">
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.sender}`}>
                                {msg.text}
                            </div>
                        ))}
                        {isLoading && <div className="message bot typing"><span></span><span></span><span></span></div>}
                        <div ref={messagesEndRef} />
                    </div>
                    <form className="chat-input-form" onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask a question..."
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading}>
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                    </form>
                </div>
            ) : (
                <button className="chat-bubble" onClick={() => setIsOpen(true)}>
                    <FontAwesomeIcon icon={faCommentDots} />
                </button>
            )}
        </div>
    );
}

export default Chatbot;