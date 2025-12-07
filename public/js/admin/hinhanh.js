/**
 * Chức năng: Xác nhận và gửi yêu cầu xóa một tệp tin khỏi hệ thống.
 * * @param {number} id - ID của tệp tin cần xóa (từ CSDL).
 * @param {string} filename - Tên của tệp tin (để hiển thị trong cảnh báo).
 */
function deleteFile(id, filename) {
    // Hiển thị hộp thoại xác nhận với tên tệp cụ thể
    if (confirm(`Bạn có chắc chắn muốn xóa file: ${filename} (ID: ${id})? Hành động này có thể không hoàn tác được!`)) {
        
        // --- LOGIC GỬI YÊU CẦU DELETE ĐẾN SERVER (BACKEND API) ---
        
        // Ví dụ sử dụng Fetch API (Giả định endpoint là /api/media/id):
        fetch(`/api/media/${id}`, {
            method: 'DELETE',
            // Có thể cần thêm headers: Authorization token, v.v.
        })
        .then(response => {
            if (response.ok) {
                alert(`Đã xóa file "${filename}" thành công!`);
                // Cập nhật giao diện:
                // window.location.reload(); // Tải lại trang
            } else {
                // Xử lý lỗi từ server
                alert(`Lỗi khi xóa file "${filename}". Vui lòng thử lại.`);
            }
        })
        .catch(error => {
            console.error('Lỗi mạng hoặc kết nối:', error);
            alert('Lỗi kết nối. Không thể xóa tệp tin.');
        });
        
        console.log(`Đã gửi yêu cầu xóa file ID: ${id}`);
    }
}