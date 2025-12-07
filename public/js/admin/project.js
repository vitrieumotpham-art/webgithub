const filterSelect_trangThai = document.getElementById('statusFilter');
const fileterSelect_noibat = document.getElementById('noibat');
const filterSelect_loaihinh=document.getElementById('loaihinh')
const filterSelect_sotang=document.getElementById('sotang')
const filterSelect_namthuchien=document.getElementById('namthuchien')
if (fileterSelect_noibat) {
    fileterSelect_noibat.addEventListener('change', function() { // Sửa: addEventListener
        const selectedValue = this.value; // Sửa: value (viết thường)
        const currenUrl = new URL(window.location.href);

        if (selectedValue) {
            currenUrl.searchParams.set('is_noibat', selectedValue);
        } else {
            currenUrl.searchParams.delete('is_noibat');
        }
        
        window.location.href = currenUrl.toString(); // Sửa: window
    });
}

// Khối dưới này cú pháp đã đúng
if (filterSelect_trangThai) {
    filterSelect_trangThai.addEventListener('change', function() {
        const selectedValue = this.value;
        const currentUrl = new URL(window.location.href);
        if (selectedValue) {
            currentUrl.searchParams.set('trang_thai', selectedValue);
        } else {
            currentUrl.searchParams.delete('trang_thai');
        }
        window.location.href = currentUrl.toString();
    });
}
if(filterSelect_loaihinh){
    filterSelect_loaihinh.addEventListener('change', function(){
        const selectedvalue=this.value;
        const currentUrl = new URL(window.location.href);
        if(selectedvalue){
            currentUrl.searchParams.set('loai_hinh', selectedvalue);
        }else{
            currentUrl.searchParams.delete('loai_hinh');
        }
        window.location.href = currentUrl.toString();
    });
}
if(filterSelect_sotang){
    filterSelect_sotang.addEventListener('change', function(){
        const selectedvalue=this.value;
        const currentUrl = new URL(window.location.href);
        if(selectedvalue){
            currentUrl.searchParams.set('so_tang', selectedvalue);
        }else{
            currentUrl.searchParams.delete('so_tang');
        }
        window.location.href = currentUrl.toString();
    });
}
if(filterSelect_namthuchien){
    filterSelect_namthuchien.addEventListener('change', function(){
        const selectedvalue=this.value;
        const currentUrl = new URL(window.location.href);
        if(selectedvalue){
            currentUrl.searchParams.set('nam_thuc_hien', selectedvalue);
        }else{
            currentUrl.searchParams.delete('nam_thuc_hien');
        }
        window.location.href = currentUrl.toString();
    });
}
// project.js
const formsearchduan = document.getElementById('search');

// THÊM DÒNG NÀY: Chỉ chạy khi tìm thấy ô search trên trang hiện tại
if (formsearchduan) { 
    formsearchduan.addEventListener('keydown', function(e) {
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
const buttonpagination= document.querySelectorAll("[button-pagination]");
if(buttonpagination){
buttonpagination.forEach(button=>{
button.addEventListener('click',()=>{
    const url= new URL(window.location.href);
const page = button.getAttribute("button-pagination");
url.searchParams.set('page',page );
window.location.href = url.href;
});
});
}