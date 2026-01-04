/**
 * Chức năng: Xác nhận và gửi yêu cầu xóa một dịch vụ.
 * * @param {number} id - ID của dịch vụ cần xóa.
 */
function deleteService(id) {
    // Hiển thị hộp thoại xác nhận
    if (confirm(`Bạn có chắc chắn muốn xóa Dịch vụ ID: ${id} và toàn bộ chi tiết liên quan? Hành động này không thể hoàn tác.`)) {
        // --- LOGIC XỬ LÝ API SẼ ĐƯỢC THÊM VÀO ĐÂY ---

        // Ví dụ tích hợp Fetch API để gửi yêu cầu DELETE đến server:
        fetch(`/api/services/${id}`, {
                method: 'DELETE',
                // Thêm các headers cần thiết, ví dụ: Authorization token
            })
            .then(response => {
                if (response.ok) {
                    alert(`Đã xóa dịch vụ ID ${id} thành công!`);
                    // Tải lại trang để cập nhật danh sách
                    window.location.reload();
                } else {
                    // Xử lý lỗi từ server
                    alert(`Lỗi khi xóa dịch vụ ID ${id}. Vui lòng thử lại.`);
                }   
            })
            .catch(error => {
                console.error('Lỗi mạng hoặc kết nối:', error);
                alert('Lỗi kết nối. Không thể xóa dịch vụ.');
            });

        console.log(`Đã gửi yêu cầu xóa dịch vụ ID: ${id}`);
    }
}
const selectDichvu = document.getElementById('statusDichvu');
if (selectDichvu) {
    selectDichvu.addEventListener('change', function () {
        const selected = this.value;
        const currenturl = new URL(window.location.href);
        if (selected) {
            currenturl.searchParams.set('status', selected);
        } else {
            currenturl.searchParams.delete('status');
        }
        window.location.href = currenturl.toString();
    });
}
// // forsearch
// project.js
const formsearchdichvu = document.getElementById('search');

// THÊM DÒNG NÀY: Chỉ chạy khi tìm thấy ô search trên trang hiện tại
if (formsearchdichvu) {
    formsearchdichvu.addEventListener('keydown', function (e) {
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

const buttonchangehoatdong = document.querySelectorAll("[button-change-hoatdong]");

if (buttonchangehoatdong.length > 0) {
    const formchangestatus = document.querySelector("#form-change-hoatdong");

    // Kiểm tra xem form và path có tồn tại không
    if (formchangestatus) {
        const path = formchangestatus.getAttribute("data-path");
        // console.log(path);

        // Lấy input ẩn dùng để gửi URL chuyển hướng (returnUrl)
        const returnUrlInput = formchangestatus.querySelector('input[name="returnUrl"]');

        buttonchangehoatdong.forEach(button => {
            button.addEventListener("click", () => {
                const statusCurrent = button.getAttribute("data-hoatdong");
                const idCurrent = button.getAttribute("data-idhoatdong");

                // ĐỌC URL CHUYỂN HƯỚNG TỪ NÚT
                const urlToReturn = button.getAttribute("data-return-url");

                let statusChange = statusCurrent == "active" ? "inactive" : "active";

                // 1. Cập nhật action của form để gửi PATCH request
                const action = path + `/${statusChange}/${idCurrent}?_method=PATCH`;
                formchangestatus.action = action;

                // 2. CẬP NHẬT GIÁ TRỊ CỦA INPUT ẨN (returnUrl)
                if (returnUrlInput && urlToReturn) {
                    returnUrlInput.value = urlToReturn;
                }

                // 3. Gửi Form
                formchangestatus.submit();
            });
        });
    }
}
// checkbox multi
const checkBoxMulti = document.querySelector("[checkbox-multi]");

if (checkBoxMulti) {
    const inputcheckBoxMulti = checkBoxMulti.querySelector("input[name=checkall]");
    const inputsId = checkBoxMulti.querySelectorAll('input[name=id]');
    if (inputcheckBoxMulti) {
        inputcheckBoxMulti.addEventListener("click", () => {
            if (inputcheckBoxMulti.checked) {
                inputsId.forEach(input => {
                    input.checked = true;
                });
            } else {
                inputsId.forEach(input => {
                    input.checked = false;
                });
            }
        });
    }

    // const type = e.target.elements.type.valuel;
    // console.log(type);

    // --- LOGIC 2: Xử lý nút con (INPUT ID) ---
    if (inputsId.length > 0) {
        inputsId.forEach(input => {
            input.addEventListener("change", () => {
                // Lấy tất cả input con đang được chọn (checked)
                const inputsChecked = checkBoxMulti.querySelectorAll('input[name=id]:checked');

                // Kiểm tra: Số lượng input đang được chọn có bằng tổng số input hay không?
                if (inputsChecked.length === inputsId.length) {
                    // Nếu bằng nhau -> Tự động chọn nút 'checkall'
                    inputcheckBoxMulti.checked = true;
                } else {
                    // Nếu không bằng nhau -> Tự động bỏ chọn nút 'checkall'
                    inputcheckBoxMulti.checked = false;
                }
            });
        });
    }
}
// end checkbox
// form change multi
// --- SỬA LẠI ĐOẠN: form change multi ---
const formchangeMulti = document.querySelector("[form-change-multi]");

if (formchangeMulti) {
    const returnUrlInput = formchangeMulti.querySelector('input[name="returnUrl"]');

    formchangeMulti.addEventListener("submit", (e) => {
        // 1. CHẶN mặc định ngay lập tức để kiểm soát hoàn toàn bằng JS
        e.preventDefault();

        // 2. Kiểm tra lại sự tồn tại của bảng chứa checkbox
        const tableDichVu = document.querySelector("[checkbox-multi]");
        if (!tableDichVu) return;

        // 3. Lấy danh sách checkbox đang được chọn
        const inputsChecked = tableDichVu.querySelectorAll("input[name='id']:checked");

        if (inputsChecked.length > 0) {
            const typechange = e.target.elements.type.value;

            // Xác nhận nếu là thao tác xóa
            if (typechange == "delete-all") {
                const isconfirm = confirm("Bạn có chắc chắn muốn xóa những dịch vụ này? Hành động này không thể hoàn tác.");
                if (!isconfirm) return; 
            }

            let ids = [];
            const inputIds = formchangeMulti.querySelector("input[name='ids']");

            inputsChecked.forEach(input => {
                const id = input.value;
                if (typechange == "position-all") {
                    // Lấy vị trí từ input cùng dòng
                    const row = input.closest("tr");
                    const position = row.querySelector("input[name='position']").value;
                    ids.push(`${id}-${position}`);
                } else {
                    ids.push(id);
                }
            });

            // Gán dữ liệu vào input ẩn
            inputIds.value = ids.join(",");

            // Cập nhật URL trả về
            if (returnUrlInput) {
                returnUrlInput.value = window.location.href;
            }

            // 4. CHỈ GỬI FORM KHI MỌI THỨ ĐÃ SẴN SÀNG
            formchangeMulti.submit();
        } else {
            // Hiển thị cảnh báo và KHÔNG làm gì thêm
            alert("Hệ thống: Vui lòng tích chọn ít nhất 1 dịch vụ trước khi áp dụng!");
        }
    });
}
const showAlert=document.querySelector("[show-alert]");
if(showAlert){
    const time=parseInt(showAlert.getAttribute("data-time"));
    setTimeout(()=>{
showAlert.classList.add("alert-hidden");
    },time);
}
// end locgic thong bao
// display image// Đặt đoạn code này vào file JavaScript của bạn (ví dụ: dichvu.js)

const uploadImageInput = document.querySelector("[upload-image-input]");
const uploadImagePreview = document.querySelector("[upload-image-preview]");

if (uploadImageInput && uploadImagePreview) {
    uploadImageInput.addEventListener("change", (e) => {
        // Kiểm tra xem người dùng đã chọn file nào chưa
        const [file] = e.target.files;

        if (file) {
            // Sử dụng FileReader để đọc dữ liệu file
            const reader = new FileReader();

            reader.onload = (loadedEvent) => {
                // Gán URL dữ liệu (data URL) của file vào thuộc tính src của thẻ img
                uploadImagePreview.src = loadedEvent.target.result;
            };

            // Bắt đầu đọc file dưới dạng Data URL (base64)
            reader.readAsDataURL(file);
        } else {
            // Nếu người dùng hủy chọn, xóa preview (tùy chọn)
            uploadImagePreview.src = "";
        }
    });
}
// end display image