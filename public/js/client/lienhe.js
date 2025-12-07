document.addEventListener("DOMContentLoaded", function() {
    // Khai báo các phần tử cần thiết
    const form = document.getElementById('contactForm');
    const statusDiv = document.getElementById('form-status');
    const faders = document.querySelectorAll('.fade-in');

    // 1. Logic Form Submission (Gửi Form Liên hệ bằng AJAX/Fetch)
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Xóa trạng thái cũ và hiển thị trạng thái "Đang gửi"
            if (statusDiv) {
                statusDiv.classList.remove('success', 'error', 'hidden');
                statusDiv.textContent = 'Đang gửi...';
            }

            try {
                // Lấy dữ liệu từ form
                const formData = new FormData(form);
                
                // Chuyển FormData sang URLSearchParams để gửi dưới dạng x-www-form-urlencoded
                // (thường dùng cho các backend truyền thống hoặc dễ xử lý hơn JSON)
                const response = await fetch(form.action, {
                    method: form.method,
                    body: new URLSearchParams(formData) 
                    // Nếu gửi dưới dạng JSON, cần: JSON.stringify(Object.fromEntries(formData)) 
                    // và thêm 'Content-Type': 'application/json'
                });

                if (response.ok) {
                    if (statusDiv) {
                        statusDiv.textContent = 'Gửi thành công! Chúng tôi sẽ liên hệ lại với bạn sớm.';
                        statusDiv.classList.add('success');
                    }
                    form.reset(); 
                } else {
                    if (statusDiv) {
                        statusDiv.textContent = 'Có lỗi xảy ra khi gửi. Vui lòng thử lại.';
                        statusDiv.classList.add('error');
                    }
                }
            } catch (error) {
                console.error('Lỗi kết nối:', error);
                if (statusDiv) {
                    statusDiv.textContent = 'Lỗi kết nối. Vui lòng kiểm tra mạng và thử lại.';
                    statusDiv.classList.add('error');
                }
            }
        });
    }

    // 2. Logic Hiệu ứng Fade In (Intersection Observer)
    const appearOptions = { threshold: 0.1 };
    
    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Kích hoạt animation
                entry.target.classList.add('appear');
                // Ngừng quan sát
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    // Bắt đầu quan sát các phần tử
    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });
});