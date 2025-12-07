document.addEventListener("DOMContentLoaded", function() {
    // Chọn tất cả các phần tử có class 'fade-in'
    const faders = document.querySelectorAll('.fade-in');

    // Thiết lập tùy chọn cho Intersection Observer
    const appearOptions = {
        // threshold: 0.25 có nghĩa là phần tử sẽ được tính là 'giao nhau' 
        // khi 25% diện tích của nó lọt vào viewport.
        threshold: 0.25
    };

    // Tạo Intersection Observer mới
    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            // Kiểm tra nếu phần tử chưa giao nhau (chưa lọt vào viewport) thì thoát
            if (!entry.isIntersecting) {
                return;
            } else {
                // Nếu phần tử giao nhau, thêm class 'appear' để kích hoạt CSS fade-in
                entry.target.classList.add('appear');
                // Ngừng theo dõi phần tử này (chỉ chạy hiệu ứng 1 lần)
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    // Áp dụng Observer cho tất cả các phần tử đã chọn
    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });
});