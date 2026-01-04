document.addEventListener("DOMContentLoaded", function() {
    // --- 1. LOGIC KANBAN BOARD (PHẦN BỊ THIẾU) ---
    const modalElement = document.getElementById('modalChangeStatus');
    
    // Sử dụng Event Delegation để bắt sự kiện click trên toàn trang
    document.addEventListener("click", function(e) {
        // Kiểm tra nếu click vào nút "Cập nhật"
        const updateBtn = e.target.closest(".js-btn-update") || e.target.closest(".btn-change-status");
        
        if (updateBtn && modalElement) {
            const id = updateBtn.getAttribute("data-id");
            const status = updateBtn.getAttribute("data-status");
            const note = updateBtn.getAttribute("data-note") || "";

            // Đổ dữ liệu vào Modal
            document.getElementById("inputContactId").value = id;
            document.getElementById("selectStatus").value = status;
            document.getElementById("inputNote").value = note;

            // Bật Modal
            if (typeof bootstrap !== 'undefined') {
                const myModal = new bootstrap.Modal(modalElement);
                myModal.show();
            }
        }

        // Kiểm tra nếu click vào nút "Xóa"
        const deleteBtn = e.target.closest(".js-delete-btn") || e.target.closest("[button-delete]");
        if (deleteBtn) {
            if (confirm("Bạn có chắc chắn muốn xóa yêu cầu này?")) {
                const id = deleteBtn.getAttribute("data-id");
                const formDelete = document.getElementById("form-delete-item");
                if (formDelete) {
                    const path = formDelete.getAttribute("data-path");
                    formDelete.action = `${path}/${id}`;
                    formDelete.submit();
                }
            }
        }
    });

    // --- 2. LOGIC GỬI FORM (GIỮ NGUYÊN CỦA BẠN) ---
    const form = document.getElementById('contactForm');
    const statusDiv = document.getElementById('form-status');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            if (statusDiv) {
                statusDiv.classList.remove('success', 'error', 'hidden');
                statusDiv.textContent = 'Đang gửi...';
            }
            try {
                const formData = new FormData(form);
                const response = await fetch(form.action, {
                    method: form.method,
                    body: new URLSearchParams(formData) 
                });
                if (response.ok) {
                    if (statusDiv) {
                        statusDiv.textContent = 'Gửi thành công!';
                        statusDiv.classList.add('success');
                    }
                    form.reset(); 
                } else {
                    if (statusDiv) {
                        statusDiv.textContent = 'Có lỗi xảy ra.';
                        statusDiv.classList.add('error');
                    }
                }
            } catch (error) {
                console.error('Lỗi:', error);
            }
        });
    }

    // --- 3. HIỆU ỨNG FADE IN (GIỮ NGUYÊN CỦA BẠN) ---
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = { threshold: 0.1 };
    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);
    faders.forEach(fader => { appearOnScroll.observe(fader); });
});