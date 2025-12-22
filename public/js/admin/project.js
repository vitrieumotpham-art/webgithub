// ====== CHỨC NĂNG LỌC (FILTERS) ======
const filterSelect_trangThai = document.getElementById('statusFilter');
const fileterSelect_noibat = document.getElementById('noibat');
const filterSelect_loaihinh=document.getElementById('loaihinh');
const filterSelect_sotang=document.getElementById('sotang');
const filterSelect_namthuchien=document.getElementById('namthuchien');

// Xử lý Lọc theo Đặc điểm (Nổi bật)
if (fileterSelect_noibat) {
    fileterSelect_noibat.addEventListener('change', function() {
        const selectedValue = this.value;
        const currenUrl = new URL(window.location.href);

        if (selectedValue) {
            currenUrl.searchParams.set('is_noibat', selectedValue);
        } else {
            currenUrl.searchParams.delete('is_noibat');
        }
        
        // Đặt lại trang về 1 khi lọc
        currenUrl.searchParams.delete('page');
        window.location.href = currenUrl.toString();
    });
}

// Xử lý Lọc theo Trạng thái
if (filterSelect_trangThai) {
    filterSelect_trangThai.addEventListener('change', function() {
        const selectedValue = this.value;
        const currentUrl = new URL(window.location.href);
        if (selectedValue) {
            currentUrl.searchParams.set('trang_thai', selectedValue);
        } else {
            currentUrl.searchParams.delete('trang_thai');
        }
        // Đặt lại trang về 1 khi lọc
        currentUrl.searchParams.delete('page');
        window.location.href = currentUrl.toString();
    });
}

// Xử lý Lọc theo Loại hình
if(filterSelect_loaihinh){
    filterSelect_loaihinh.addEventListener('change', function(){
        const selectedvalue=this.value;
        const currentUrl = new URL(window.location.href);
        if(selectedvalue){
            currentUrl.searchParams.set('loai_hinh', selectedvalue);
        }else{
            currentUrl.searchParams.delete('loai_hinh');
        }
        // Đặt lại trang về 1 khi lọc
        currentUrl.searchParams.delete('page');
        window.location.href = currentUrl.toString();
    });
}

// Xử lý Lọc theo Số tầng
if(filterSelect_sotang){
    filterSelect_sotang.addEventListener('change', function(){
        const selectedvalue=this.value;
        const currentUrl = new URL(window.location.href);
        if(selectedvalue){
            currentUrl.searchParams.set('so_tang', selectedvalue);
        }else{
            currentUrl.searchParams.delete('so_tang');
        }
        // Đặt lại trang về 1 khi lọc
        currentUrl.searchParams.delete('page');
        window.location.href = currentUrl.toString();
    });
}

// Xử lý Lọc theo Năm thực hiện
if(filterSelect_namthuchien){
    filterSelect_namthuchien.addEventListener('change', function(){
        const selectedvalue=this.value;
        const currentUrl = new URL(window.location.href);
        if(selectedvalue){
            currentUrl.searchParams.set('nam_thuc_hien', selectedvalue);
        }else{
            currentUrl.searchParams.delete('nam_thuc_hien');
        }
        // Đặt lại trang về 1 khi lọc
        currentUrl.searchParams.delete('page');
        window.location.href = currentUrl.toString();
    });
}

// ====== CHỨC NĂNG TÌM KIẾM (SEARCH) ======
const formsearchduan = document.getElementById('search');

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
            
            // Đặt lại trang về 1 khi tìm kiếm
            url.searchParams.delete('page');
            window.location.href = url.href;
        }
    });
}

// ====== CHỨC NĂNG PHÂN TRANG (PAGINATION) ======
const buttonpagination= document.querySelectorAll("[button-pagination]");

if(buttonpagination.length > 0){
    buttonpagination.forEach(button=>{
        button.addEventListener('click',()=>{
            const url= new URL(window.location.href);
            const page = button.getAttribute("button-pagination");
            url.searchParams.set('page',page );
            window.location.href = url.href;
        });
    });
}

// ====== CHỨC NĂNG XÓA ĐƠN LẺ (SINGLE DELETE) ======
const buttondelete = document.querySelectorAll("[button-delete]");

if (buttondelete.length > 0) {
    const formdeleteItem = document.querySelector("#form-delete-item");

    if (formdeleteItem) {
        // Lấy data-path từ form ẩn
        let datapath = formdeleteItem.getAttribute("data-path");

        buttondelete.forEach(button => {
            button.addEventListener("click", () => {
                const isconfirm = confirm("Bạn có xác nhận xóa không?");

                if (isconfirm) {
                    const id = button.getAttribute("data-id");
                    const returnUrl = encodeURIComponent(window.location.href); 

                    // CHỖ NÀY: Kiểm tra nếu datapath không có dấu / ở đầu thì tự thêm vào
                    if(!datapath.startsWith('/')) {
                        datapath = '/' + datapath;
                    }

                    // Xây dựng action
                    const action = `${datapath}/${id}?_method=DELETE&returnUrl=${returnUrl}`;
                    
                    formdeleteItem.action = action;
                    formdeleteItem.submit(); 
                }
            });
        });
    }
}
// end delete

// ====== CHỨC NĂNG THAY ĐỔI TRẠNG THÁI HOẠT ĐỘNG (NỔI BẬT/BÌNH THƯỜNG) ======
const buttonchangehoatdongduan = document.querySelectorAll("[button-change-hoatdongduan]");

if (buttonchangehoatdongduan.length > 0) {
    const formchangestatus = document.querySelector("#form-change-hoatdongduan");
    
    if (formchangestatus) {
        const path = formchangestatus.getAttribute("data-path");
        // returnUrlInput sẽ được sử dụng để backend nhận biết URL chuyển hướng sau khi cập nhật
        const returnUrlInput = formchangestatus.querySelector('input[name="returnUrl"]');

        buttonchangehoatdongduan.forEach(button => {
            button.addEventListener("click", () => {
                const statusCurrent = button.getAttribute("data-hoatdong"); // "true" hoặc "false" (string)
                const idCurrent = button.getAttribute("data-idhoatdong");
                // Lấy URL cần trả về từ thuộc tính data-return-url của button
                const urlToReturn = button.getAttribute("data-return-url");
                
                // Đảo ngược trạng thái: Nếu đang là "true" thì chuyển thành "false" và ngược lại
                let statusChange = (statusCurrent === "true") ? "false" : "true"; 
                
                // 1. Cập nhật action của form: Dùng _method=PATCH để báo hiệu cho backend
                const action = path + `/${statusChange}/${idCurrent}?_method=PATCH`;
                formchangestatus.action = action;
                
                // 2. GÁN URL CHUYỂN HƯỚNG VÀO INPUT ẨN (Backend sẽ dùng giá trị này)
                if (returnUrlInput && urlToReturn) {
                    returnUrlInput.value = urlToReturn;
                }

                // 3. Gửi Form
                formchangestatus.submit();
            });
        });
    }
}
// end change hoat dong
// chon tat ca
const chontatca = document.getElementById("checkboxAll");

// SỬA LỖI: Truy vấn bằng class '.item-checkbox' thay vì name='ids'
// Điều này đảm bảo chỉ đếm các checkbox của sản phẩm, loại trừ các input ẩn khác
const checkboxnho = document.querySelectorAll(".item-checkbox"); 

if (chontatca && checkboxnho.length > 0) {
    // === Xử lý khi nhấn CHECK ALL ===
    chontatca.addEventListener("click", () => {
        checkboxnho.forEach(input => {
            input.checked = chontatca.checked;
        });
    });

    // === Xử lý khi nhấn Checkbox Cá nhân ===
    checkboxnho.forEach(input => {
        input.addEventListener("change", () => {
            // Lấy số lượng đã chọn bằng cách truy vấn class đã checked
            const inputschecked = document.querySelectorAll(".item-checkbox:checked");
            
            console.log("Tổng số lượng checkbox:", checkboxnho.length); // Sẽ là 8
            console.log("Số lượng đã chọn:", inputschecked.length); 
            
            if (inputschecked.length === checkboxnho.length) {
                chontatca.checked = true;
            } else {
                chontatca.checked = false;
            }
        
        });
    });
    
    // (Đảm bảo bạn đã định nghĩa hoặc bỏ qua hàm capNhatTrangThaiHanhDong nếu chưa làm)
}
// end chon tat ca
// su kien thay doi all
// ... (các đoạn code Lọc, Tìm kiếm, Phân trang, Xóa đơn lẻ, Thay đổi trạng thái đơn lẻ đã có)

// ====== CHỨC NĂNG THAY ĐỔI HÀNG LOẠT (MULTI-CHANGE) ======
const formthaydoiduan = document.querySelector("[form-change-multi]");

if (formthaydoiduan) {
    formthaydoiduan.addEventListener("submit", function(e) {
        e.preventDefault(); 
        const inputschecked = document.querySelectorAll(".item-checkbox:checked");
        const idsInput = this.querySelector('input[name="ids"]');
        const typeSelect = this.querySelector('select[name="type"]').value;
        if (inputschecked.length === 0) {
            alert("Vui lòng chọn ít nhất một dự án để thực hiện hành động!");
            return; 
        }
        if (typeSelect === "--chon hanh dong--" || !typeSelect) {
             alert("Vui lòng chọn một hành động để áp dụng!");
             return; 
        }
        let ids = [];
        inputschecked.forEach(input => {
            ids.push(input.value); 
        });
        idsInput.value = ids.join(","); 
        this.querySelector('input[name="returnUrl"]').value = window.location.href;
        this.submit();
    });
}
//end sukien thay doi all
//preview hinh anh

const updateImage = document.querySelector("[upload-image]");

if (updateImage) {
    const upload = document.querySelector("[upload-img-input-duan]");
    const uploadPreview = document.querySelector("[upload-image-preview]");

    upload.addEventListener("change", (e) => {
        const file = e.target.files[0]; // Lấy file đầu tiên từ input
        if (file) {
            // Dòng này cực kỳ quan trọng: nó biến file thành đường dẫn ảnh
            uploadPreview.src = URL.createObjectURL(file); 
        }
    });
}
//end hinh anh
