// Tìm đoạn code xử lý button-delete
const buttonsDelete = document.querySelectorAll("[button-delete]");
if (buttonsDelete.length > 0) {
    const formDeleteItem = document.querySelector("#form-delete-item");
    const path = formDeleteItem.getAttribute("data-path"); // Ví dụ: /admin/doanhmuc/delete?_method=DELETE

    buttonsDelete.forEach(button => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có chắc muốn xóa danh mục này?");
            if (isConfirm) {
                const id = button.getAttribute("data-id");
                
                // CÁCH SỬA: Tách path và query string để chèn ID vào giữa
                // path gốc: /admin/doanhmuc/delete?_method=DELETE
                const action = path.replace("?", `/${id}?`); 
                
                formDeleteItem.action = action;
                formDeleteItem.submit();
            }
        });
    });
}