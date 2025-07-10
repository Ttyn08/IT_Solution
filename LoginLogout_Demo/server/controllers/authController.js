// This file will contain the logic for sign-up, sign-in, forgot password
// We'll fill this in later
const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // Để tạo token ngẫu nhiên
const nodemailer = require('nodemailer'); // Để gửi email

const JWT_SECRET = process.env.JWT_SECRET;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const APP_URL = process.env.APP_URL || 'http://localhost:3000'; // URL cơ sở của ứng dụng

// --- KHỞI TẠO TRANSPORTER CHO ETHEREAL EMAIL ---
let transporter; // Khai báo biến transporter ở ngoài

nodemailer.createTestAccount((err, account) => {
    if (err) {
        console.error('Failed to create a testing account. ' + err.message);
        return process.exit(1);
    }

    console.log('----------------------------------------------------');
    console.log('Tài khoản Ethereal Email đã được tạo thành công!');
    console.log('User: ' + account.user);
    console.log('Pass: ' + account.pass);
    // Dòng này rất quan trọng để có URL xem email
    console.log('Ethereal Email Preview URL (Initial): ' + nodemailer.getTestMessageUrl(account));
    console.log('----------------------------------------------------');

    transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
            user: account.user,
            pass: account.pass,
        },
    });
});


// Hàm xử lý Đăng ký người dùng (giữ nguyên từ Phần 3)
exports.signup = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ các trường.' });
    }
    try {
        const [existingUser] = await pool.query('SELECT id FROM users WHERE email = ? OR username = ?', [email, username]);
        if (existingUser.length > 0) {
            return res.status(409).json({ message: 'Email hoặc tên người dùng đã tồn tại.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
        res.status(201).json({ message: 'Đăng ký thành công! Vui lòng đăng nhập.' });
    } catch (error) {
        console.error('Lỗi khi đăng ký người dùng:', error);
        res.status(500).json({ message: 'Lỗi máy chủ khi đăng ký.' });
    }
};

// Hàm xử lý Đăng nhập người dùng (giữ nguyên từ Phần 3)
exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Vui lòng điền email và mật khẩu.' });
    }
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];
        if (!user) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
        }
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Đăng nhập thành công!', token });
    } catch (error) {
        console.error('Lỗi khi đăng nhập người dùng:', error);
        res.status(500).json({ message: 'Lỗi máy chủ khi đăng nhập.' });
    }
};

// Hàm xử lý yêu cầu Quên mật khẩu
// Hàm xử lý yêu cầu Quên mật khẩu
exports.forgotPassword = async (req, res) => {
    console.log('--- Hàm forgotPassword đã được gọi ---');
    console.log('Email nhận được từ frontend:', req.body.email); // Kiểm tra xem email có được gửi lên không

    const { email } = req.body;
    if (!email) {
        console.error('Lỗi: Email bị thiếu trong yêu cầu từ frontend.');
        return res.status(400).json({ message: 'Vui lòng cung cấp email.' });
    }

    try {
        console.log(`Đang truy vấn database cho email: ${email}`);
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];

        if (!user) {
            console.log(`Kết quả truy vấn: KHÔNG tìm thấy người dùng với email: ${email}. Sẽ trả về thông báo chung.`);
            // Không tiết lộ rằng email không tồn tại để tránh rò rỉ thông tin người dùng
            return res.status(200).json({ message: 'Nếu email tồn tại, một liên kết đặt lại mật khẩu đã được gửi.' });
        }

        console.log(`Kết quả truy vấn: ĐÃ tìm thấy người dùng: ${user.email} (ID: ${user.id}).`);

        // Tạo token đặt lại ngẫu nhiên và thời gian hết hạn (1 giờ)
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 giờ từ bây giờ
        console.log(`Đã tạo resetToken: ${resetToken}, hết hạn vào: ${resetTokenExpiry}`);

        // Lưu token và thời gian hết hạn vào DB
        console.log('Đang cập nhật reset_token vào database...');
        await pool.query(
            'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?',
            [resetToken, resetTokenExpiry, user.id]
        );
        console.log('Đã cập nhật reset_token vào database thành công.');

        // Tạo URL đặt lại mật khẩu
        const resetUrl = `${APP_URL}/reset-password.html?token=${resetToken}`;
        console.log(`URL đặt lại mật khẩu: ${resetUrl}`);

        // Cấu hình email
        const mailOptions = {
            from: 'noreply@yourdomain.com', // Bạn có thể thay đổi thành EMAIL_USER nếu dùng SMTP thực
            to: user.email,
            subject: 'Yêu cầu đặt lại mật khẩu của bạn',
            html: `<p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng nhấp vào liên kết này để đặt lại mật khẩu của bạn:</p>
                   <p><a href="${resetUrl}">${resetUrl}</a></p>
                   <p>Liên kết này sẽ hết hạn sau 1 giờ.</p>`
        };

        try {
            if (!transporter) {
                console.error('Lỗi: Transporter chưa được khởi tạo. Có thể do lỗi Ethereal account lúc khởi động server.');
                return res.status(500).json({ message: 'Lỗi server: Transporter chưa được khởi tạo.' });
            }
            console.log('Đang cố gắng gửi email với Nodemailer...');
            let info = await transporter.sendMail(mailOptions); // Lưu thông tin kết quả gửi mail
            console.log('Đã gửi email thành công!');

            // *** DÒNG NÀY SẼ IN RA URL XEM EMAIL CỤ THỂ ĐÃ GỬI ***
            console.log("Message sent (ID): %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info)); // <-- Đây là URL bạn cần!

            res.status(200).json({ message: 'Nếu email tồn tại, một liên kết đặt lại mật khẩu đã được gửi.' });

        } catch (error) {
            console.error('LỖI KHI GỬI EMAIL ĐẶT LẠI MẬT KHẨU VỚI ETHEREAL:', error);
            res.status(500).json({ message: 'Lỗi máy chủ khi gửi email đặt lại mật khẩu.' });
        }
    } catch (error) {
        console.error('LỖI KHI XỬ LÝ QUÊN MẬT KHẨU (lỗi truy vấn DB hoặc lỗi khác trong logic):', error);
        res.status(500).json({ message: 'Lỗi máy chủ khi xử lý quên mật khẩu.' });
    }
};

// Hàm xử lý đặt lại mật khẩu
exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ message: 'Token và mật khẩu mới là bắt buộc.' });
    }
    if (newPassword.length < 6) {
        return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự.' });
    }

    try {
        // Tìm người dùng bằng token và kiểm tra thời gian hết hạn
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()',
            [token]
        );
        const user = rows[0];

        if (!user) {
            return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
        }

        // Băm mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Cập nhật mật khẩu và xóa token đặt lại
        await pool.query(
            'UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
            [hashedPassword, user.id]
        );

        res.status(200).json({ message: 'Mật khẩu đã được đặt lại thành công!' });

    } catch (error) {
        console.error('Lỗi khi đặt lại mật khẩu:', error);
        res.status(500).json({ message: 'Lỗi máy chủ khi đặt lại mật khẩu.' });
    }
};