// console.log("Frontend script loaded!");
// We will add more JavaScript here for client-side interactions
document.addEventListener('DOMContentLoaded', () => {
    // Lấy các phần tử DOM
    const loginSection = document.getElementById('login-section');
    const signupSection = document.getElementById('signup-section');
    const forgotPasswordSection = document.getElementById('forgot-password-section');

    const showSignupLink = document.getElementById('show-signup');
    const showLoginLink = document.getElementById('show-login');
    const showForgotPasswordLink = document.getElementById('show-forgot-password');
    const showLoginFromForgotLink = document.getElementById('show-login-from-forgot');

    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const forgotPasswordForm = document.getElementById('forgot-password-form');

    const loginMessage = document.getElementById('login-message');
    const signupMessage = document.getElementById('signup-message');
    const forgotPasswordMessage = document.getElementById('forgot-password-message');

    // Hàm để hiển thị một phần cụ thể và ẩn các phần còn lại
    function showSection(sectionToShow) {
        loginSection.classList.remove('active');
        signupSection.classList.remove('active');
        forgotPasswordSection.classList.remove('active');

        sectionToShow.classList.add('active');

        // Xóa thông báo khi chuyển đổi phần
        hideMessage(loginMessage);
        hideMessage(signupMessage);
        hideMessage(forgotPasswordMessage);
    }

    // Hàm hiển thị thông báo
    function showMessage(element, message, type) {
        element.textContent = message;
        element.className = `message ${type}`; // type có thể là 'success' hoặc 'error'
        element.style.display = 'block';
    }

    // Hàm ẩn thông báo
    function hideMessage(element) {
        element.textContent = '';
        element.className = 'message';
        element.style.display = 'none';
    }

    // --- Xử lý sự kiện click vào các liên kết chuyển đổi ---
    showSignupLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(signupSection);
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(loginSection);
    });

    showForgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(forgotPasswordSection);
    });

    showLoginFromForgotLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(loginSection);
    });

    // --- Xử lý gửi biểu mẫu Đăng ký ---
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Ngăn chặn hành vi gửi biểu mẫu mặc định

        hideMessage(signupMessage); // Ẩn thông báo trước đó

        const username = document.getElementById('signup-username').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;

        if (password !== confirmPassword) {
            showMessage(signupMessage, 'Mật khẩu và xác nhận mật khẩu không khớp.', 'error');
            return;
        }

        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (response.ok) { // Mã trạng thái 2xx
                showMessage(signupMessage, data.message, 'success');
                signupForm.reset(); // Xóa biểu mẫu
                // Tùy chọn: Chuyển hướng đến trang đăng nhập sau khi đăng ký thành công
                setTimeout(() => {
                    showSection(loginSection);
                    showMessage(loginMessage, 'Đăng ký thành công! Vui lòng đăng nhập.', 'success');
                }, 2000); // Chờ 2 giây trước khi chuyển
            } else { // Mã trạng thái lỗi (4xx, 5xx)
                showMessage(signupMessage, data.message || 'Đăng ký không thành công.', 'error');
            }
        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu đăng ký:', error);
            showMessage(signupMessage, 'Có lỗi xảy ra. Vui lòng thử lại sau.', 'error');
        }
    });

    // --- Xử lý gửi biểu mẫu Đăng nhập ---
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        hideMessage(loginMessage);

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                showMessage(loginMessage, data.message, 'success');
                loginForm.reset();
                // Lưu token vào localStorage (hoặc sessionStorage)
                localStorage.setItem('jwtToken', data.token);
                console.log('JWT Token:', data.token);

                // Tùy chọn: Chuyển hướng đến trang dashboard hoặc trang chủ
                setTimeout(() => {
                    alert('Đăng nhập thành công! Token đã được lưu.');
                    // window.location.href = '/dashboard.html'; // Chuyển hướng đến trang khác
                }, 1000);

            } else {
                showMessage(loginMessage, data.message || 'Đăng nhập không thành công.', 'error');
            }
        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu đăng nhập:', error);
            showMessage(loginMessage, 'Có lỗi xảy ra. Vui lòng thử lại sau.', 'error');
        }
    });

    // --- Xử lý gửi biểu mẫu Quên mật khẩu (chưa có backend) ---
    // forgotPasswordForm.addEventListener('submit', async (e) => {
    //     e.preventDefault();

    //     hideMessage(forgotPasswordMessage);

    //     const email = document.getElementById('forgot-email').value;

    //     if (!email) {
    //         showMessage(forgotPasswordMessage, 'Vui lòng nhập địa chỉ email của bạn.', 'error');
    //         return;
    //     }

    //     try {
            // Phần này sẽ gọi API cho forgot password sau khi chúng ta xây dựng nó ở backend
            // Hiện tại, chúng ta chỉ mô phỏng phản hồi
            // const response = await fetch('/api/forgot-password', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({ email }),
            // });

            // const data = await response.json();

            // if (response.ok) {
            //     showMessage(forgotPasswordMessage, data.message, 'success');
            //     forgotPasswordForm.reset();
            // } else {
            //     showMessage(forgotPasswordMessage, data.message || 'Yêu cầu không thành công.', 'error');
            // }

            // Mã mô phỏng phản hồi:
    //         showMessage(forgotPasswordMessage, 'Nếu email tồn tại, liên kết đặt lại mật khẩu đã được gửi.', 'success');
    //         forgotPasswordForm.reset();
    //         setTimeout(() => {
    //             showSection(loginSection); // Quay lại trang đăng nhập
    //         }, 3000);


    //     } catch (error) {
    //         console.error('Lỗi khi gửi yêu cầu quên mật khẩu:', error);
    //         showMessage(forgotPasswordMessage, 'Có lỗi xảy ra. Vui lòng thử lại sau.', 'error');
    //     }
    // });

    // --- Xử lý gửi biểu mẫu Quên mật khẩu ---
    forgotPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        hideMessage(forgotPasswordMessage);

        const email = document.getElementById('forgot-email').value;

        if (!email) {
            showMessage(forgotPasswordMessage, 'Vui lòng nhập địa chỉ email của bạn.', 'error');
            return;
        }

        try {
            // *** BỎ COMMENT ĐOẠN CODE NÀY ***
            const response = await fetch('/api/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) { // Mã trạng thái 2xx
                showMessage(forgotPasswordMessage, data.message, 'success');
                forgotPasswordForm.reset(); // Xóa biểu mẫu
                setTimeout(() => {
                    showSection(loginSection); // Quay lại trang đăng nhập
                }, 3000);
            } else { // Mã trạng thái lỗi (4xx, 5xx)
                showMessage(forgotPasswordMessage, data.message || 'Yêu cầu không thành công.', 'error');
            }

            // *** XÓA HOẶC BÌNH LUẬN DÒNG NÀY (mã mô phỏng) ***
             // showMessage(forgotPasswordMessage, 'Nếu email tồn tại, liên kết đặt lại mật khẩu đã được gửi.', 'success');
            // forgotPasswordForm.reset();
            // setTimeout(() => {
            // showSection(loginSection);
        // }, 3000);


        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu quên mật khẩu:', error);
            showMessage(forgotPasswordMessage, 'Có lỗi xảy ra. Vui lòng thử lại sau.', 'error');
        }
    });

    // Ban đầu hiển thị phần đăng nhập
    showSection(loginSection);
});

//hàm này vào script.js để kiểm tra API được bảo vệ
async function testProtectedApi(token) {
    try {
        const response = await fetch('/api/protected', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}` // Gửi token trong header
            }
        });
        const data = await response.json();
        if (response.ok) {
            console.log('Truy cập API bảo vệ thành công:', data);
            alert(`Truy cập thành công: ${data.message}`);
        } else {
            console.error('Truy cập API bảo vệ thất bại:', data.message);
            alert(`Truy cập thất bại: ${data.message}`);
        }
    } catch (error) {
        console.error('Lỗi khi gọi API bảo vệ:', error);
        alert('Lỗi khi gọi API bảo vệ.');
    }
}