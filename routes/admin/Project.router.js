const express = require('express');
const route = express.Router();
const multer = require("multer");

// Cấu hình Multer xử lý file trong bộ nhớ để đẩy lên Cloudinary
const upload = multer();

// Import Middleware & Controller
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const controller = require("../../controllers/admin/Projects.controller"); 

// --- 1. ROUTE TĨNH (Phải đặt lên đầu để tránh trùng lặp tham số :id) ---

// Trang danh sách dự án chính
route.get("/", controller.duan); 

// Trang thùng rác (Xem danh sách đã xóa)
route.get("/trash", controller.trash);

// Trang giao diện thêm mới
route.get("/create", controller.createduan);

// Xử lý thay đổi nhiều bản ghi cùng lúc (Xóa tất cả, đổi trạng thái tất cả)
route.patch("/change-multi", controller.changeMulti);


// --- 2. ROUTE XỬ LÝ DỮ LIỆU (POST / PATCH / DELETE) ---

// Xử lý lưu dự án mới vào DB
route.post(
    "/create", 
    upload.single("hinh_anh"), 
    uploadCloud.upload,        
    controller.createduanPost  
);

// Xử lý thay đổi Nổi bật / Thường cho 1 dự án
route.patch("/change-hoatdongduan/:is_noibat/:id", controller.changeHoatdong);

// Xóa vào thùng rác (Xóa mềm - deleted: true)
route.delete("/delete/:id", controller.deleteItem); 

// Khôi phục dự án từ thùng rác
route.patch("/restore/:id", controller.restore);

// Xóa vĩnh viễn khỏi Database
route.delete("/delete-permanently/:id", controller.deletePermanently);


// --- 3. ROUTE CHI TIẾT & CHỈNH SỬA (Có tham số :id động) ---

// Trang xem chi tiết dự án
route.get("/detail/:id", controller.detail); 

// Trang giao diện chỉnh sửa
route.get("/edit/:id", controller.edit);

// Xử lý cập nhật dữ liệu khi chỉnh sửa
route.patch(
    "/edit/:id",
    upload.single("hinh_anh"),
    uploadCloud.upload,
    controller.editpatch
);

module.exports = route;