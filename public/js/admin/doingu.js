/**
 * Chức năng: Xác nhận và gửi yêu cầu xóa một thành viên đội ngũ.
 * @param {number} id - ID của thành viên cần xóa.
 */
function deleteMember(id) {
    // Hiển thị hộp thoại xác nhận
    if (confirm(`Bạn có chắc chắn muốn xóa thành viên ID: ${id} khỏi đội ngũ? Hành động này không thể hoàn tác.`)) {
        // Gửi yêu cầu DELETE đến server
        // Thay thế console.log bằng lệnh fetch/axios thực tế
        
        // Ví dụ sử dụng Fetch API (Giả định endpoint là /api/team/id):
        fetch(`/api/team/${id}`, {
            method: 'DELETE',
            // Thêm headers như 'Authorization' nếu cần xác thực
        })
        .then(response => {
            if (response.ok) {
                alert(`Đã xóa thành viên ID ${id} thành công!`);
                // Cập nhật giao diện:
                window.location.reload(); // Hoặc xóa dòng khỏi bảng
            } else {
                // Xử lý lỗi từ server (ví dụ: 404 Not Found)
                alert(`Lỗi khi xóa thành viên ID ${id}. Server phản hồi lỗi.`);
            }
        })
        .catch(error => {
            console.error('Lỗi mạng hoặc kết nối:', error);
            alert('Lỗi kết nối. Vui lòng kiểm tra mạng.');
        });
        
        console.log(`Đã gửi yêu cầu xóa thành viên ID: ${id}`);
    }
}
const selectStatus= document.getElementById('statusDoingu');
if(selectStatus){
    selectStatus.addEventListener('change', function(){
      const selectedValue= this.value;
      const url=new URL(window.location.href);
      if(selectedValue){
        url.searchParams.set("status", selectedValue);
      }else{
        url.searchParams.delete("status")
      }
      console.log(selectedValue);
      window.location.href=url.toString();
    });
}
const formsearchdoingu = document.getElementById('search');

// THÊM DÒNG NÀY: Chỉ chạy khi tìm thấy ô search trên trang hiện tại
if (formsearchdoingu) { 
    formsearchdoingu.addEventListener('keydown', function(e) {
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
