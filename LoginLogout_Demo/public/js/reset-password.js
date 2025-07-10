document.addEventListener('DOMContentLoaded', () => {
    const resetPasswordForm = document.getElementById('reset-password-form');
    const resetPasswordMessage = document.getElementById('reset-password-message');
    const backToLoginLink = document.getElementById('back-to-login');

    // Hàm hiển thị thông báo
    function showMessage(element, message, type) {
        element.textContent = message;
        element.className = `message ${type}`;
        element.style.display = 'block';
    }

    // Hàm ẩn thông báo
    function hideMessage(element) {
        element.textContent = '';
        element.className = 'message';
        element.style.display = 'none';
    }

    // Lấy token từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
        showMessage(resetPasswordMessage, 'Token đặt lại mật khẩu không hợp lệ hoặc bị thiếu.', 'error');
        resetPasswordForm.style.display = 'none'; // Ẩn form nếu không có token
        return;
    }

    resetPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideMessage(resetPasswordMessage);

        const newPassword = document.getElementById('new-password').value;
        const confirmNewPassword = document.getElementById('confirm-new-password').value;

        if (newPassword !== confirmNewPassword) {
            showMessage(resetPasswordMessage, 'Mật khẩu mới và xác nhận mật khẩu không khớp.', 'error');
            return;
        }

        if (newPassword.length < 6) { // Yêu cầu mật khẩu tối thiểu 6 ký tự
            showMessage(resetPasswordMessage, 'Mật khẩu phải có ít nhất 6 ký tự.', 'error');
            return;
        }

        try {
            const response = await fetch('/api/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                showMessage(resetPasswordMessage, data.message, 'success');
                resetPasswordForm.reset();
                setTimeout(() => {
                    window.location.href = '/'; // Quay lại trang đăng nhập
                }, 3000);
            } else {
                showMessage(resetPasswordMessage, data.message || 'Đặt lại mật khẩu không thành công.', 'error');
            }
        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu đặt lại mật khẩu:', error);
            showMessage(resetPasswordMessage, 'Có lỗi xảy ra. Vui lòng thử lại sau.', 'error');
        }
    });

    // Quay lại đăng nhập
    backToLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '/';
    });
});