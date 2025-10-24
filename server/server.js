require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import Route Files
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const userRoutes = require('./routes/userRoutes');

// Initialize App
const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration (Production Ready)
const allowedOrigins = [
    'http://localhost:3000',
    process.env.FRONTEND_URL 
];

app.use(cors({
    origin: function(origin, callback){
        if(!origin || allowedOrigins.indexOf(origin) !== -1){
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

// Middleware
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);

// Root API Route for Testing
app.get('/api', (req, res) => {
    res.json({ message: "Welcome to the LearnSphere API!" });
});

// Connect to MongoDB and Start Server
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("Successfully connected to MongoDB Atlas");
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
})
.catch(err => {
    console.error("Database connection error:", err);
    process.exit(1);
});