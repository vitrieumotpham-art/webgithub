const selectTrangthai = document.getElementById('#statusBaiviet'); // Hoặc 'select[name="status"]'

if (selectTrangthai) {
    selectTrangthai.addEventListener('change', function() {
        const selectItem = this.value;
        const currentUrl = new URL(window.location.href);
        console.log(selectItem);
        if (selectItem) {
            currentUrl.searchParams.set('status', selectItem);
        } else {    
            currentUrl.searchParams.delete('status'); // Đã sửa lỗi chính tả 'deleted' -> 'delete'
        }


        window.location.href = currentUrl.toString();
    });
}
const formsearchbaiviet = document.getElementById('search');
// THÊM DÒNG NÀY: Chỉ chạy khi tìm thấy ô search trên trang hiện tại
if (formsearchbaiviet) { 
    formsearchbaiviet.addEventListener('keydown', function(e) {
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
const buttonPagination= document.querySelectorAll("[button-pagination]");
if(buttonPagination){
    buttonPagination.forEach(button => {
        button.addEventListener("click", ()=>{
           const page=button.getAttribute("button-pagination");
          let url = new URL(window.location.href); 
          url.searchParams.set('page', page);
           window.location.href = url.href;
        });
        
    });
}

const buttonchangestatus= document.querySelectorAll("[button-change-status]");
if(buttonchangestatus.length > 0){
    const formchangestatus=document.querySelector("#form-change-status");
    const path= formchangestatus.getAttribute("data-path");
    console.log(path);
buttonchangestatus.forEach(button => {
button.addEventListener("click", ()=>{
    const statusCurrent= button.getAttribute("data-status");
    const idCurrent=button.getAttribute("data-id");
    let statusChange= statusCurrent =="active" ? "inactive" : "active";
    const action= path + `/${statusChange}/${idCurrent}?_method=PATCH`;
        console.log(action);
        formchangestatus.action=action;
        formchangestatus.submit();
});
});
}