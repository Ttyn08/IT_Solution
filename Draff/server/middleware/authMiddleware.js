const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

exports.protect = (req, res, next) => {
    // 1. Kiểm tra xem token có được gửi trong header không
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]; // Lấy token sau 'Bearer '
    }

    if (!token) {
        return res.status(401).json({ message: 'Không có token, không được ủy quyền.' });
    }

    try {
        // 2. Xác minh token
        const decoded = jwt.verify(token, JWT_SECRET);

        // 3. Gắn thông tin người dùng vào đối tượng request để các route sau có thể sử dụng
        // (Trong một ứng dụng thực tế, bạn có thể truy vấn DB để lấy đầy đủ thông tin người dùng dựa trên decoded.id)
        req.user = decoded; // decoded sẽ chứa { id: user.id, email: user.email }

        next(); // Chuyển sang middleware hoặc route handler tiếp theo
    } catch (error) {
        console.error('Lỗi xác thực token:', error.message);
        return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
    }
};