// Xử lý Khôi phục
const buttonsRestore = document.querySelectorAll("[button-restore]");
if (buttonsRestore.length > 0) {
    const formRestore = document.querySelector("#form-restore-item");
    const path = formRestore.getAttribute("data-path");
    buttonsRestore.forEach(button => {
        button.addEventListener("click", () => {
            const id = button.getAttribute("data-id");
            formRestore.action = `${path}/${id}?_method=PATCH`;
            formRestore.submit();
        });
    });
}

// Xử lý Xóa vĩnh viễn
const buttonsDeletePermanently = document.querySelectorAll("[button-delete-permanently]");
if (buttonsDeletePermanently.length > 0) {
    const formDelete = document.querySelector("#form-delete-permanently");
    const path = formDelete.getAttribute("data-path");
    buttonsDeletePermanently.forEach(button => {
        button.addEventListener("click", () => {
            if (confirm("Hành động này không thể hoàn tác. Bạn có chắc chắn xóa vĩnh viễn?")) {
                const id = button.getAttribute("data-id");
                formDelete.action = `${path}/${id}?_method=DELETE`;
                formDelete.submit();
            }
        });
    });
}