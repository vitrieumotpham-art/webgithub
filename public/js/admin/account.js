/**
 * Chức năng: Thay đổi trạng thái (Khóa/Mở khóa) của tài khoản.
 * Lưu ý: Hiện tại chỉ log ra console, cần tích hợp Fetch/AJAX để gửi request đến API.
 * * @param {number} id - ID của tài khoản cần thay đổi trạng thái.
 * @param {string} newStatus - Trạng thái mới ('active' để mở khóa, 'inactive' hoặc giá trị khác để khóa).
 */
function toggleStatus(id, newStatus) {
    // Xác định hành động (Mở khóa nếu newStatus là 'active', ngược lại là Khóa)
    const action = newStatus === 'active' ? 'Mở khóa' : 'Khóa';

    if (confirm(`Bạn có chắc chắn muốn ${action} tài khoản ID: ${id}?`)) {
        // --- LOGIC XỬ LÝ API SẼ ĐƯỢC THÊM VÀO ĐÂY ---
        
        // Ví dụ sử dụng fetch API (giả định):
        /*
        fetch(`/api/admin/users/${id}/status`, {
            method: 'PATCH', // Hoặc PUT
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus })
        })
        .then(response => {
            if (response.ok) {
                alert(`${action} tài khoản ID ${id} thành công!`);
                // location.reload(); // Tải lại trang để cập nhật bảng
            } else {
                alert(`Lỗi khi ${action} tài khoản ID ${id}.`);
            }
        })
        .catch(error => console.error('Lỗi mạng:', error));
        */
       
        console.log(`Gửi yêu cầu ${action} tài khoản ID: ${id}`);
    }
}

/**
 * Chức năng: Xóa vĩnh viễn tài khoản người dùng/admin.
 * Lưu ý: Hiện tại chỉ log ra console, cần tích hợp Fetch/AJAX để gửi request đến API.
 * * @param {number} id - ID của tài khoản cần xóa.
 * @param {string} name - Tên của người dùng/tài khoản (để hiển thị cảnh báo rõ ràng hơn).
 */
function deleteAccount(id, name) {
    if (confirm(`CẢNH BÁO: Bạn có chắc chắn muốn XÓA VĨNH VIỄN tài khoản của ${name} (ID: ${id})? Hành động này không thể hoàn tác!`)) {
        // --- LOGIC XỬ LÝ API SẼ ĐƯỢC THÊM VÀO ĐÂY ---
        
        // Ví dụ sử dụng fetch API (giả định):
        /*
        fetch(`/api/admin/users/${id}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                alert(`Đã XÓA tài khoản ${name} (ID ${id}) thành công!`);
                // location.reload(); // Tải lại trang để cập nhật bảng
            } else {
                alert(`Lỗi khi XÓA tài khoản ${name}.`);
            }
        })
        .catch(error => console.error('Lỗi mạng:', error));
        */
        
        console.log(`Gửi yêu cầu XÓA tài khoản ID: ${id}`);
    }
}
const selectedtaikhoan= document.getElementById('selectTaikhoan');
if(selectedtaikhoan){
    selectedtaikhoan.addEventListener('change', function(){
      const selected= this.value;
      const currenturl= new URL(window.location.href);
      if(selected){
        currenturl.searchParams.set('role',selected);

      }else{
        currenturl.searchParams.delete('role');
      }
       window.location.href=currenturl.toString();
    });
   
}
const selectedtrangthaitaikhoan= document.getElementById('selectTrangthaitaikhoan');
if(selectedtrangthaitaikhoan){
    selectedtrangthaitaikhoan.addEventListener('change', function(){
      const selected= this.value;
      const currenturl= new URL(window.location.href);
      if(selected){
        currenturl.searchParams.set('status',selected);

      }else{
        currenturl.searchParams.delete('status');
      }
       window.location.href=currenturl.toString();
    });
   
}
const formsearchaccount = document.getElementById('search');

// THÊM DÒNG NÀY: Chỉ chạy khi tìm thấy ô search trên trang hiện tại
if (formsearchaccount) { 
    formsearchaccount.addEventListener('keydown', function(e) {
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