// JavaScript cho hiệu ứng fade-in khi cuộn trang
const sections = document.querySelectorAll('.fade-in-section');

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

// --- MÃ MỚI: TỰ ĐỘNG THAY ĐỔI ẢNH NỀN HERO SECTION ---

// 1. Lấy phần tử hero
const heroElement = document.getElementById('hero');

// 2. Tạo một danh sách (array) chứa 5 URL ảnh
const backgroundImages = [
    './image/home/photo-1.jfif', 
    './image/home/photo-2.jpg', 
    './image/home/photo-3.jfif', 
    './image/home/photo-4.jfif', 
    './image/home/photo-5.jfif'  
];

// 3. Biến để theo dõi ảnh hiện tại
let currentImageIndex = 0;

// 4. Đặt một chu kỳ lặp lại cứ sau 3 giây
setInterval(() => {
    // Tăng chỉ số của ảnh, và quay về 0 nếu hết danh sách
    currentImageIndex = (currentImageIndex + 1) % backgroundImages.length;
    
    // Cập nhật lại thuộc tính background-image của hero
    heroElement.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('${backgroundImages[currentImageIndex]}')`;

}, 8000);