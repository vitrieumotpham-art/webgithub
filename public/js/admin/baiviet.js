// 1. Lọc theo Trạng thái
const selectTrangthai = document.getElementById('statusBaiviet');
if (selectTrangthai) {
    selectTrangthai.addEventListener('change', function() {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('page', 1);
        if (this.value) currentUrl.searchParams.set('status', this.value);
        else currentUrl.searchParams.delete('status');
        window.location.href = currentUrl.toString();
    });
}

// 2. Tìm kiếm
const formSearch = document.querySelector("#search"); // Dùng querySelector cho chắc chắn
if (formSearch) {
    const inputSearch = formSearch.querySelector("input[name='keyword']");
    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        const currentUrl = new URL(window.location.href);
        const keyword = inputSearch.value;
        currentUrl.searchParams.set('page', 1);
        if (keyword) currentUrl.searchParams.set('keyword', keyword);
        else currentUrl.searchParams.delete('keyword');
        window.location.href = currentUrl.href;
    });
}

// 3. Phân trang
const buttonPagination = document.querySelectorAll("[button-pagination]");
buttonPagination.forEach(button => {
    button.addEventListener("click", () => {
        const page = button.getAttribute("button-pagination");
        let url = new URL(window.location.href); 
        url.searchParams.set('page', page);
        window.location.href = url.href;
    });
});

// 4. Thay đổi trạng thái đơn lẻ
const buttonChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonChangeStatus.length > 0) {
    const formChangeStatus = document.querySelector("#form-change-status");
    const path = formChangeStatus.getAttribute("data-path");
    const returnUrlInput = formChangeStatus.querySelector('input[name="returnUrl"]');

    buttonChangeStatus.forEach(button => {
        button.addEventListener("click", () => {
            const statusCurrent = button.getAttribute("data-status");
            const id = button.getAttribute("data-id");
            const urlToReturn = button.getAttribute("data-return-url"); 
            const statusChange = statusCurrent == "active" ? "inactive" : "active";
            
            formChangeStatus.action = `${path}/${statusChange}/${id}?_method=PATCH`;
            if (returnUrlInput) returnUrlInput.value = urlToReturn;
            formChangeStatus.submit();
        });
    });
}

// 5. Preview ảnh Bài viết
// Preview ảnh cho Bài Viết
// Khối xử lý Preview Ảnh cho Bài Viết
(function() {
    // 1. Tìm vùng chứa bao ngoài
    const uploadImageArea = document.querySelector("[upload-image]");

    if (uploadImageArea) {
        // 2. Tìm đúng Input và Ảnh theo tên bạn đã đặt trong Pug
        const uploadInput = uploadImageArea.querySelector("[upload-img-input-baiviet]");
        const uploadPreview = uploadImageArea.querySelector("[upload-image-preview-baiviet]");

        if (uploadInput && uploadPreview) {
            uploadInput.addEventListener("change", (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    
                    reader.onload = function(event) {
                        // Gán dữ liệu ảnh vào thẻ img
                        uploadPreview.src = event.target.result;
                        
                        // Hiển thị ảnh (vì mặc định đang là display: none)
                        uploadPreview.style.display = "block";
                        uploadPreview.style.marginTop = "15px";
                        uploadPreview.style.borderRadius = "5px";
                        uploadPreview.style.border = "1px solid #ddd";
                    };

                    reader.readAsDataURL(file);
                }
            });
        }
    }
})();
// Xử lý xóa bài viết
const buttonsDeleteBaiviet = document.querySelectorAll("[button-delete-baiviet]");
if (buttonsDeleteBaiviet.length > 0) {
    const formDeleteBaiviet = document.querySelector("#form-delete-baiviet");
    const path = formDeleteBaiviet.getAttribute("data-path");

    buttonsDeleteBaiviet.forEach(button => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có chắc chắn muốn xóa bài viết này?");
            if (isConfirm) {
                const id = button.getAttribute("data-id");
                const action = `${path}/${id}?_method=DELETE`;
                formDeleteBaiviet.action = action;
                formDeleteBaiviet.submit();
            }
        });
    });
}