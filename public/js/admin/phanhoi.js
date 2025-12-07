const trangthaiDanhgia= document.getElementById('trangthaiDanhgia');
const ratingDanhgia= document.getElementById('ratingDanhgia');
if (trangthaiDanhgia) {
    trangthaiDanhgia.addEventListener('change', function() {
        const selectedValue = this.value;
        const currentUrl = new URL(window.location.href);
        if (selectedValue) {
            currentUrl.searchParams.set('status', selectedValue);
        } else {
            currentUrl.searchParams.delete('status');
        }
        window.location.href = currentUrl.toString();
    });
}
if (ratingDanhgia) {
    ratingDanhgia.addEventListener('change', function() {
        const selectedValue = this.value;
        const currentUrl = new URL(window.location.href);
        if (selectedValue) {
            currentUrl.searchParams.set('rating', selectedValue);
        } else {
            currentUrl.searchParams.delete('rating');
        }
        window.location.href = currentUrl.toString();
    });
}
const formsearchphanhoi = document.getElementById('search');

// THÊM DÒNG NÀY: Chỉ chạy khi tìm thấy ô search trên trang hiện tại
if (formsearchphanhoi) { 
    formsearchphanhoi.addEventListener('keydown', function(e) {
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
