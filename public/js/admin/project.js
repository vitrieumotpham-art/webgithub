// ====== CHỨC NĂNG LỌC (FILTERS) ======
const filterSelect_trangThai = document.getElementById('statusFilter');
const fileterSelect_noibat = document.getElementById('noibat');
const filterSelect_loaihinh = document.getElementById('loaihinh');
const filterSelect_sotang = document.getElementById('sotang');
const filterSelect_namthuchien = document.getElementById('namthuchien');

if (fileterSelect_noibat) {
    fileterSelect_noibat.addEventListener('change', function() {
        const selectedValue = this.value;
        const currenUrl = new URL(window.location.href);
        if (selectedValue) { currenUrl.searchParams.set('is_noibat', selectedValue); } 
        else { currenUrl.searchParams.delete('is_noibat'); }
        currenUrl.searchParams.delete('page');
        window.location.href = currenUrl.toString();
    });
}

if (filterSelect_trangThai) {
    filterSelect_trangThai.addEventListener('change', function() {
        const selectedValue = this.value;
        const currentUrl = new URL(window.location.href);
        if (selectedValue) { currentUrl.searchParams.set('trang_thai', selectedValue); } 
        else { currentUrl.searchParams.delete('trang_thai'); }
        currentUrl.searchParams.delete('page');
        window.location.href = currentUrl.toString();
    });
}

if(filterSelect_loaihinh){
    filterSelect_loaihinh.addEventListener('change', function(){
        const selectedvalue=this.value;
        const currentUrl = new URL(window.location.href);
        if(selectedvalue){ currentUrl.searchParams.set('loai_hinh', selectedvalue); }
        else{ currentUrl.searchParams.delete('loai_hinh'); }
        currentUrl.searchParams.delete('page');
        window.location.href = currentUrl.toString();
    });
}

if(filterSelect_sotang){
    filterSelect_sotang.addEventListener('change', function(){
        const selectedvalue=this.value;
        const currentUrl = new URL(window.location.href);
        if(selectedvalue){ currentUrl.searchParams.set('so_tang', selectedvalue); }
        else{ currentUrl.searchParams.delete('so_tang'); }
        currentUrl.searchParams.delete('page');
        window.location.href = currentUrl.toString();
    });
}

if(filterSelect_namthuchien){
    filterSelect_namthuchien.addEventListener('change', function(){
        const selectedvalue=this.value;
        const currentUrl = new URL(window.location.href);
        if(selectedvalue){ currentUrl.searchParams.set('nam_thuc_hien', selectedvalue); }
        else{ currentUrl.searchParams.delete('nam_thuc_hien'); }
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
            if (keyword) { url.searchParams.set('keyword', keyword); } 
            else { url.searchParams.delete('keyword'); }
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

// Chức năng xóa đơn lẻ
const buttonsDelete = document.querySelectorAll("[button-delete]");
if (buttonsDelete.length > 0) {
    const formDelete = document.querySelector("#form-delete-item");
    const path = formDelete.getAttribute("data-path"); // Lấy ra /admin/project/delete

    buttonsDelete.forEach(button => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có chắc chắn muốn xóa dự án này?");
            if (isConfirm) {
                // Lấy ID từ thuộc tính data-id của nút bấm
                const id = button.getAttribute("data-id");
                
                if (id) {
                    // TẠO URL CHUẨN: /admin/project/delete/658xxx?_method=DELETE
                    const action = `${path}/${id}?_method=DELETE`;
                    
                    // Gán vào action của form
                    formDelete.action = action;
                    
                    // Gửi form đi
                    formDelete.submit();
                } else {
                    console.error("Lỗi: Không tìm thấy data-id trên nút bấm!");
                }
            }
        });
    });
}

// ====== THAY ĐỔI TRẠNG THÁI HOẠT ĐỘNG ĐƠN LẺ ======
const buttonchangehoatdongduan = document.querySelectorAll("[button-change-hoatdongduan]");
if (buttonchangehoatdongduan.length > 0) {
    const formchangestatus = document.querySelector("#form-change-hoatdongduan");
    if (formchangestatus) {
        const path = formchangestatus.getAttribute("data-path");
        const returnUrlInput = formchangestatus.querySelector('input[name="returnUrl"]');
        buttonchangehoatdongduan.forEach(button => {
            button.addEventListener("click", () => {
                const statusCurrent = button.getAttribute("data-hoatdong");
                const idCurrent = button.getAttribute("data-idhoatdong");
                const urlToReturn = button.getAttribute("data-return-url");
                let statusChange = (statusCurrent === "true") ? "false" : "true"; 
                formchangestatus.action = path + `/${statusChange}/${idCurrent}?_method=PATCH`;
                if (returnUrlInput && urlToReturn) { returnUrlInput.value = urlToReturn; }
                formchangestatus.submit();
            });
        });
    }
}

// ====== CHỌN TẤT CẢ (CHECKBOX ALL) ======
const chontatca = document.getElementById("checkboxAll");
const checkboxnho = document.querySelectorAll(".item-checkbox"); 
if (chontatca && checkboxnho.length > 0) {
    chontatca.addEventListener("click", () => {
        checkboxnho.forEach(input => { input.checked = chontatca.checked; });
    });
    checkboxnho.forEach(input => {
        input.addEventListener("change", () => {
            const inputschecked = document.querySelectorAll(".item-checkbox:checked");
            chontatca.checked = (inputschecked.length === checkboxnho.length);
        });
    });
}

// ====== CHỨC NĂNG THAY ĐỔI HÀNG LOẠT (MULTI-CHANGE) ======
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault(); 
        const checkboxesChecked = document.querySelectorAll(".item-checkbox:checked");
        const typeChange = e.target.elements.type.value; 

        if (typeChange && checkboxesChecked.length > 0) {
            if (typeChange === "delete-all") {
                if (!confirm("Bạn có chắc chắn muốn xóa tất cả các dự án đã chọn?")) return;
            }
            let ids = [];
            const inputIds = formChangeMulti.querySelector("input[name='ids']");
            checkboxesChecked.forEach((input) => { ids.push(input.value); });
            
            // SỬA LỖI: join bằng dấu phẩy, KHÔNG CÓ dấu cách để khớp với Controller
            inputIds.value = ids.join(","); 
            formChangeMulti.submit();
        } else {
            alert(!typeChange ? "Vui lòng chọn một hành động!" : "Vui lòng chọn ít nhất một dự án!");
        }
    });
}

// ====== XỬ LÝ HÌNH ẢNH (UPLOAD PREVIEW) ======
const updateImage = document.querySelector("[upload-image]");
if (updateImage) {
    const upload = document.querySelector("[upload-img-input-duan]") || document.querySelector("[upload-image-input]");
    const uploadPreview = document.querySelector("[upload-image-preview]");
    if(upload && uploadPreview) {
        upload.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                uploadPreview.src = URL.createObjectURL(file); 
                uploadPreview.style.display = "block";
            }
        });
    }
}

// ====== CHỨC NĂNG SẮP XẾP (SORT) ======
const sortElement = document.querySelector("[sort]");
if (sortElement) {
    let url = new URL(window.location.href);
    const sortSelect = sortElement.querySelector("[sort-select]");
    const sortClear = sortElement.querySelector("[sort-clear]");
    sortSelect.addEventListener("change", (e) => {
        const [sortKey, sortValue] = e.target.value.split("-");
        url.searchParams.set("sortKey", sortKey);
        url.searchParams.set("sortValue", sortValue);
        window.location.href = url.href;
    });
    sortClear.addEventListener("click", () => {
        url.searchParams.delete("sortKey");
        url.searchParams.delete("sortValue");
        window.location.href = url.href;
    });
    const currentSortKey = url.searchParams.get("sortKey");
    const currentSortValue = url.searchParams.get("sortValue");
    if (currentSortKey && currentSortValue) {
        const optionSelected = sortSelect.querySelector(`option[value='${currentSortKey}-${currentSortValue}']`);
        if (optionSelected) optionSelected.selected = true;
    }
}