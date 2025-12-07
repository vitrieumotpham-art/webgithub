document.addEventListener("DOMContentLoaded", function() {
    // 1. Chọn tất cả các phần tử sẽ áp dụng hiệu ứng.
    const faders = document.querySelectorAll('.fade-in');

    // 2. Thiết lập tùy chọn quan sát (threshold: 0.1 nghĩa là khi 10% phần tử lọt vào viewport).
    const appearOptions = { threshold: 0.1 };

    // 3. Tạo Intersection Observer.
    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            // Kiểm tra nếu phần tử lọt vào viewport (isIntersecting là true)
            if (entry.isIntersecting) {
                // Thêm class 'appear' để kích hoạt hiệu ứng CSS.
                entry.target.classList.add('appear');
                // Ngừng quan sát phần tử này (chỉ chạy hiệu ứng một lần).
                observer.unobserve(entry.target);
            }
            // Nếu không lọt vào, không làm gì cả.
        });
    }, appearOptions);

    // 4. Áp dụng Observer cho từng phần tử.
    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });
});
/* public/js/script.js */
document.addEventListener("DOMContentLoaded", function() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));
});