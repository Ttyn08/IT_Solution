require('dotenv').config();

const express = require('express');
const path = require('path');
const { testDbConnection } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const { protect } = require('./middleware/authMiddleware'); // Import middleware
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Use authentication routes with a /api prefix
app.use('/api', authRoutes);

// Ví dụ về một tuyến đường được bảo vệ
// Chỉ những người dùng đã đăng nhập và có token hợp lệ mới có thể truy cập
app.get('/api/protected', protect, (req, res) => {
    // Nếu đến được đây, req.user đã chứa thông tin từ token
    res.status(200).json({ message: `Chào mừng ${req.user.email} đến với trang bảo vệ!`, user: req.user });
});

// Basic route (keep if you want, or remove if /api handles all)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

async function startServer() {
    await testDbConnection();
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

startServer();