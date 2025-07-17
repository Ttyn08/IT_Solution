document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    const mainNavbar = document.getElementById('main-navbar');

    if (mobileMenu && mainNavbar) {
        mobileMenu.addEventListener('click', function() {
            // Toggle class 'active' cho icon menu
            mobileMenu.classList.toggle('active');
            // Toggle class 'active' cho navbar
            mainNavbar.classList.toggle('active');
        });

        // Đóng menu khi nhấp vào một liên kết (tùy chọn)
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mainNavbar.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    mainNavbar.classList.remove('active');
                }
            });
        });
    }
});
