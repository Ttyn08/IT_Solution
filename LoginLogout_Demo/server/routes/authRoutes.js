// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Đảm bảo đường dẫn này đúng

// Route đăng ký
router.post('/signup', authController.signup);

// Route đăng nhập
router.post('/login', authController.login);

// Route quên mật khẩu (DÒNG NÀY PHẢI CÓ)
router.post('/forgot-password', authController.forgotPassword);

// Route đặt lại mật khẩu (DÒNG NÀY CŨNG PHẢI CÓ)
router.post('/reset-password', authController.resetPassword);

module.exports = router;