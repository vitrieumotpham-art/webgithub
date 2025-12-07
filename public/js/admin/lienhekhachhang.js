/**
 * Chức năng: Giả lập hiển thị chi tiết nội dung của một yêu cầu liên hệ.
 * Trong thực tế nên dùng Modal (popup) hoặc trang xem chi tiết riêng.
 * * @param {number} id - ID của yêu cầu liên hệ.
 * @param {string} message - Nội dung tin nhắn/yêu cầu từ khách hàng.
 */
function viewDetails(id, message) {
    // Sử dụng alert() để giả lập hiển thị chi tiết
    alert(`Yêu cầu chi tiết ID ${id}:\n\n${message}`);
    
    // Ví dụ về cách dùng Modal thực tế (cần thư viện UI):
    // showModal('Chi tiết yêu cầu', message); 
}

/**
 * Chức năng: Xác nhận và gửi yêu cầu xóa một yêu cầu liên hệ.
 * * @param {number} id - ID của yêu cầu liên hệ cần xóa.
 */
function deleteContact(id) {
    if (confirm(`Bạn có chắc chắn muốn xóa yêu cầu liên hệ ID: ${id}? Hành động này không thể hoàn tác.`)) {
        
        // --- LOGIC GỬI YÊU CẦU DELETE ĐẾN SERVER (BACKEND API) ---
        
        // Ví dụ sử dụng Fetch API:
        /*
        fetch(`/api/contacts/${id}`, {
            method: 'DELETE',
            // Thêm headers nếu cần
        })
        .then(response => {
            if (response.ok) {
                alert(`Đã xóa yêu cầu liên hệ ID ${id} thành công!`);
                window.location.reload(); // Cập nhật bảng
            } else {
                alert(`Lỗi khi xóa yêu cầu liên hệ ID ${id}.`);
            }
        })
        .catch(error => {
            console.error('Lỗi mạng:', error);
            alert('Lỗi kết nối. Không thể xóa yêu cầu.');
        });
        */
        
        console.log(`Đã gửi yêu cầu xóa liên hệ ID: ${id}`);
        alert(`Đang xóa yêu cầu liên hệ ID: ${id}. Vui lòng kiểm tra console.`);
    }
}
const formsearchlienhe = document.getElementById('search');

// THÊM DÒNG NÀY: Chỉ chạy khi tìm thấy ô search trên trang hiện tại
if (formsearchlienhe) { 
    formsearchlienhe.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            
            let url = new URL(window.location.href);
            const keyword = e.target.value;
            
            if (keyword) {
                url.searchParams.set('keyword', keyword);
            } else {
                url.searchParams.delete('keyword');
            }
            
            window.location.href = url.href;
        }
    });
}
// forsearch