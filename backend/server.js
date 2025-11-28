const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://127.0.0.1:5500',
    credentials: true
}));
app.use(express.json());

// MySQL Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'urban_gardening',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
pool.getConnection()
    .then(connection => {
        console.log('✅ MySQL Database Connected Successfully!');
        connection.release();
    })
    .catch(err => {
        console.error('❌ MySQL Connection Error:', err.message);
    });

// ==================== AUTH ROUTES ====================

// Sign Up Route
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        if (password.length < 6) {
            return res.status(400).json({ 
                success: false, 
                message: 'Password must be at least 6 characters' 
            });
        }

        // Check if user already exists
        const [existingUsers] = await pool.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email already registered' 
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        // Create JWT token
        const token = jwt.sign(
            { userId: result.insertId, email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: result.insertId,
                name,
                email
            }
        });

    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during signup' 
        });
    }
});

// Login Route
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and password are required' 
            });
        }

        // Find user
        const [users] = await pool.query(
            'SELECT id, name, email, password FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        const user = users[0];

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during login' 
        });
    }
});

// Verify Token Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Access token required' 
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ 
                success: false, 
                message: 'Invalid or expired token' 
            });
        }
        req.user = user;
        next();
    });
};

// Get User Profile (Protected Route)
app.get('/api/user/profile', authenticateToken, async (req, res) => {
    try {
        const [users] = await pool.query(
            'SELECT id, name, email, created_at FROM users WHERE id = ?',
            [req.user.userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        res.json({
            success: true,
            user: users[0]
        });

    } catch (error) {
        console.error('Profile Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// ==================== SHOWCASE ROUTES ====================

// Get all showcase posts
app.get('/api/showcase', async (req, res) => {
    try {
        const [posts] = await pool.query(`
            SELECT 
                sp.id, 
                sp.title, 
                sp.description, 
                sp.image_url, 
                sp.created_at,
                u.name as author_name,
                u.email as author_email
            FROM showcase_posts sp
            JOIN users u ON sp.user_id = u.id
            ORDER BY sp.created_at DESC
        `);

        res.json({
            success: true,
            posts
        });

    } catch (error) {
        console.error('Get Showcase Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// Create showcase post (Protected)
app.post('/api/showcase', authenticateToken, async (req, res) => {
    try {
        const { title, description, image_url } = req.body;

        if (!title || !description) {
            return res.status(400).json({ 
                success: false, 
                message: 'Title and description are required' 
            });
        }

        const [result] = await pool.query(
            'INSERT INTO showcase_posts (user_id, title, description, image_url) VALUES (?, ?, ?, ?)',
            [req.user.userId, title, description, image_url]
        );

        // Get the created post with user info
        const [posts] = await pool.query(`
            SELECT 
                sp.id, 
                sp.title, 
                sp.description, 
                sp.image_url, 
                sp.created_at,
                u.name as author_name,
                u.email as author_email
            FROM showcase_posts sp
            JOIN users u ON sp.user_id = u.id
            WHERE sp.id = ?
        `, [result.insertId]);

        res.status(201).json({
            success: true,
            message: 'Post created successfully',
            post: posts[0]
        });

    } catch (error) {
        console.error('Create Showcase Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Urban Gardening API is running!',
        timestamp: new Date().toISOString()
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
});
