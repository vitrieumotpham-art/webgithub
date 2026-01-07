// --- XỬ LÝ TRANG THÙNG RÁC BÀI VIẾT ---

// 1. Logic Khôi phục bài viết (Restore)
const buttonsRestore = document.querySelectorAll("[button-restore]");
if (buttonsRestore.length > 0) {
    const formRestore = document.querySelector("#form-restore-item");
    const path = formRestore.getAttribute("data-path");

    buttonsRestore.forEach(button => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có chắc chắn muốn khôi phục bài viết này về danh sách chính không?");
            if (isConfirm) {
                const id = button.getAttribute("data-id");
                // Gộp path + id + override method PATCH
                const action = `/${path}/${id}?_method=PATCH`;
                
                formRestore.action = action;
                formRestore.submit();
            }
        });
    });
}

// 2. Logic Xóa vĩnh viễn (Delete Permanently)
const buttonsDeletePermanently = document.querySelectorAll("[button-delete-permanently]");
if (buttonsDeletePermanently.length > 0) {
    const formDeletePermanently = document.querySelector("#form-delete-permanently");
    const path = formDeletePermanently.getAttribute("data-path");

    buttonsDeletePermanently.forEach(button => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("CẢNH BÁO: Bài viết này sẽ bị xóa vĩnh viễn khỏi hệ thống và không thể lấy lại. Bạn vẫn muốn xóa?");
            if (isConfirm) {
                const id = button.getAttribute("data-id");
                // Gộp path + id + override method DELETE
                const action = `/${path}/${id}?_method=DELETE`;
                
                formDeletePermanently.action = action;
                formDeletePermanently.submit();
            }
        });
    });
}

// 3. Logic Tìm kiếm (Nếu bạn muốn nút tìm kiếm trong thùng rác hoạt động ngay lập tức)
const formSearch = document.querySelector("#form-search");
if (formSearch) {
    let url = new URL(window.location.href);
    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        const keyword = e.target.elements.keyword.value;

        if (keyword) {
            url.searchParams.set("keyword", keyword);
        } else {
            url.searchParams.delete("keyword");
        }
        window.location.href = url.href;
    });
}