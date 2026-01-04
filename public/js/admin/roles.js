// per

const tablePermissions=document.querySelector("[table-permissions]");
if(tablePermissions){
    const buttonsubmit=document.querySelector("[button-submit]");

    buttonsubmit.addEventListener("click",()=>{
        let per =[];
        const rows = tablePermissions.querySelectorAll("[data-name]");
        rows.forEach(row =>{
            const name=row.getAttribute("data-name");
            const inputs=row.querySelectorAll("input");
            if(name=="id"){
                inputs.forEach(input => {
                 const id = input.value;
                 per.push({
                    id:id,
                    per:[]
                 });
                } );
            }else{
                inputs.forEach((input,index) =>{
                    const checked= input.checked;
                    if(checked){ per[index].per.push(name);}
                   
                });
            }
        });
        console.log(per);
        if(per.length>0){
            const formChangePermission=document.querySelector("#form-change-permissions");
            const inputper= formChangePermission.querySelector("input[name='permissions']");
            inputper.value=JSON.stringify(per);
            formChangePermission.submit();


        }
    });
}


// end per
// Xử lý đổi trạng thái
const formChangeStatus = document.querySelector("#form-change-status");
if(formChangeStatus) {
    const path = formChangeStatus.getAttribute("data-path");

    window.changeStatus = (id, status) => {
        // Tạo action URL ví dụ: /admin/accounts/change-status/active/123
        const action = path + `/${status}/${id}?_method=PATCH`; 
        formChangeStatus.action = action;
        formChangeStatus.submit();
    }
}

// Xử lý xóa tài khoản
const formDeleteItem = document.querySelector("#form-delete-item");
if(formDeleteItem) {
    const path = formDeleteItem.getAttribute("data-path");

    window.deleteAccount = (id) => {
        const isConfirm = confirm("Bạn có chắc chắn muốn xóa tài khoản này?");
        if(isConfirm) {
            const action = `${path}/${id}?_method=DELETE`;
            formDeleteItem.action = action;
            formDeleteItem.submit();
        }
    }
}