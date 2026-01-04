document.addEventListener("DOMContentLoaded", function () {
    // 1. TÌM KIẾM
    const inputSearch = document.getElementById('search');
    if (inputSearch) {
        inputSearch.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                let url = new URL(window.location.href);
                const keyword = e.target.value.trim();
                if (keyword) url.searchParams.set('keyword', keyword);
                else url.searchParams.delete('keyword');
                window.location.href = url.href;
            }
        });
    }

    // 2. SỰ KIỆN CLICK
    document.addEventListener("click", function (e) {
        // A. XỬ LÝ NÚT CẬP NHẬT
        const btnUpdate = e.target.closest(".js-btn-update");
        if (btnUpdate) {
            document.getElementById("inputContactId").value = btnUpdate.getAttribute("data-id");
            document.getElementById("selectStatus").value = btnUpdate.getAttribute("data-status");
            document.getElementById("inputNote").value = btnUpdate.getAttribute("data-note");

            const modal = new bootstrap.Modal(document.getElementById('modalChangeStatus'));
            modal.show();
        }

        // B. XỬ LÝ NÚT LỊCH SỬ (Đảm bảo thoát được)
        const btnHistory = e.target.closest(".js-view-history");
        if (btnHistory) {
            const history = JSON.parse(btnHistory.getAttribute("data-history") || "[]");
            document.getElementById("customerNameHeader").innerText = btnHistory.getAttribute("data-name");
            
            const content = document.getElementById("historyContent");
            if (history.length === 0) {
                content.innerHTML = '<p class="text-center">Chưa có dữ liệu.</p>';
            } else {
                content.innerHTML = history.slice().reverse().map(item => `
                    <div class="timeline-item">
                        <div class="timeline-dot"></div>
                        <div class="small fw-bold text-info">${item.status}</div>
                        <div class="text-muted small">${new Date(item.updatedAt).toLocaleString('vi-VN')} - ${item.updatedBy?.fullName || 'NV'}</div>
                        <div class="bg-light p-2 mt-1 rounded small border">${item.note || '...'}</div>
                    </div>
                `).join('');
            }
            // Khởi tạo Modal mới mỗi lần click để tránh đơ nút thoát
            const modalH = new bootstrap.Modal(document.getElementById('modalHistory'));
            modalH.show();
        }

        // C. XỬ LÝ XÓA
        const btnDelete = e.target.closest(".js-delete-btn");
        if (btnDelete) {
            if (confirm("Xóa yêu cầu này?")) {
                const formDelete = document.getElementById("form-delete-item");
                const path = formDelete.getAttribute("data-path");
                formDelete.action = `${path}/${btnDelete.getAttribute("data-id")}`;
                formDelete.submit();
            }
        }
    });
});