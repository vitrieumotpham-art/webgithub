/**
 * Chức năng: Thay đổi trạng thái (Khóa/Mở khóa)
 * Gọi từ Pug: changeStatus(id, status)
 */
function changeStatus(id, newStatus) {
    const action = newStatus === 'active' ? 'mở khóa' : 'khóa';
    const formChangeStatus = document.querySelector("#form-change-status");

    if (formChangeStatus) {
        if (confirm(`Bạn có chắc chắn muốn ${action} tài khoản này?`)) {
            const path = formChangeStatus.getAttribute("data-path");
            // Cấu trúc URL: /admin/account/change-status/active/ID?_method=PATCH
            const actionUrl = `${path}/${newStatus}/${id}?_method=PATCH`;

            formChangeStatus.action = actionUrl;
            formChangeStatus.submit();
        }
    } else {
        console.error("Lỗi: Không tìm thấy form #form-change-status trên trang!");
    }
}

/**
 * Chức năng: Xóa tài khoản (Xóa mềm)
 * Gọi từ Pug: deleteItem(id)
 */
function deleteItem(id) {
    const formDelete = document.querySelector("#form-delete-item");
    if (formDelete) {
        if (confirm(`Bạn có chắc chắn muốn XÓA tài khoản này?`)) {
            const path = formDelete.getAttribute("data-path");
            // SỬA TẠI ĐÂY: Đổi PATCH thành DELETE
            const actionUrl = `${path}/${id}?_method=DELETE`; 
            
            formDelete.action = actionUrl;
            formDelete.submit();
        }
    }
}

/**
 * Các sự kiện khác sau khi trang load xong
 */
document.addEventListener("DOMContentLoaded", () => {
    
    // --- BỘ LỌC THEO QUYỀN (ROLE) ---
    const selectRole = document.getElementById('selectTaikhoan');
    if (selectRole) {
        selectRole.addEventListener('change', function () {
            const selected = this.value;
            const currenturl = new URL(window.location.href);
            if (selected) {
                currenturl.searchParams.set('role', selected);
            } else {
                currenturl.searchParams.delete('role');
            }
            // Reset trang khi lọc
            currenturl.searchParams.delete('page');
            window.location.href = currenturl.toString();
        });
    }

    // --- BỘ LỌC THEO TRẠNG THÁI ---
    const selectStatus = document.getElementById('selectTrangthaitaikhoan');
    if (selectStatus) {
        selectStatus.addEventListener('change', function () {
            const selected = this.value;
            const currenturl = new URL(window.location.href);
            if (selected) {
                currenturl.searchParams.set('status', selected);
            } else {
                currenturl.searchParams.delete('status');
            }
            // Reset trang khi lọc
            currenturl.searchParams.delete('page');
            window.location.href = currenturl.toString();
        });
    }

    // --- TÌM KIẾM (SEARCH) ---
    const inputSearch = document.getElementById('search');
    if (inputSearch) {
        inputSearch.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();

                let url = new URL(window.location.href);
                const keyword = e.target.value;

                if (keyword) {
                    url.searchParams.set('keyword', keyword);
                } else {
                    url.searchParams.delete('keyword');
                }
                // Reset về trang 1 khi tìm kiếm
                url.searchParams.delete('page'); 

                window.location.href = url.href;
            }
        });
    }
});
