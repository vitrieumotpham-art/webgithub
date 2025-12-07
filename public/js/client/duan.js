document.addEventListener("DOMContentLoaded", function() {
    
    // --- PHẦN 1: HIỆU ỨNG FADE-IN KHI CUỘN ---
    const faders = document.querySelectorAll('.fade-in');
    
    const appearOptions = {
        threshold: 0.2, // Phần tử hiện ra 20% mới bắt đầu hiệu ứng (cho mượt hơn)
        rootMargin: "0px 0px -50px 0px" // Offset một chút để không hiện quá sớm
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return; // Nếu chưa vào khung hình thì bỏ qua
            
            // Nếu đã vào khung hình:
            entry.target.classList.add('appear');
            observer.unobserve(entry.target); // Ngừng theo dõi để không chạy lại hiệu ứng
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });


    // --- PHẦN 2: LOGIC LỌC DỰ ÁN (FILTER) ---
    const filterButtons = document.querySelectorAll('.filter-item');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // 1. Ngăn hành động mặc định thẻ a
            e.preventDefault(); 

            // 2. Xử lý class 'active' cho nút bấm (Đổi màu nút đang chọn)
            document.querySelector('.filter-item.active')?.classList.remove('active');
            button.classList.add('active');

            // 3. Lấy loại dự án cần lọc
            const filterValue = button.getAttribute('data-filter');

            // 4. Duyệt qua từng dự án để Ẩn/Hiện
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filterValue === 'all' || filterValue === category) {
                    // Hiện lại: Xóa display none để nó quay về layout gốc (Grid/Flex)
                    card.style.display = ''; 
                    
                    // Thêm chút hiệu ứng fade-in nhẹ khi lọc
                    card.classList.add('show-card'); 
                } else {
                    // Ẩn đi
                    card.style.display = 'none';
                    card.classList.remove('show-card');
                }
            });
        });
    });
});