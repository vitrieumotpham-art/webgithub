const express = require('express');
const route = express.Router();
const multer = require("multer");

// KHÔNG dùng storageMulter cũ vì Vercel không cho lưu file vào ổ đĩa
const upload = multer(); // Sử dụng Memory Storage để có buffer đẩy lên Cloud

// Import Middleware xử lý đẩy ảnh lên Cloudinary
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

// Import controller 
const controller = require("../../controllers/admin/Projects.controller"); 

// --- ROUTE CHI TIẾT & DANH SÁCH ---
route.get("/", controller.duan); 
route.get("/detail/:id", controller.detail); 

// --- ROUTE TẠO MỚI ---
route.get("/create", controller.createduan);
route.post(
    "/create", 
    upload.single("hinh_anh"), // Nhận file từ form
    uploadCloud.upload,        // Đẩy lên Cloudinary và trả về link trong req.body.hinh_anh
    controller.createduanPost  // Lưu vào Database
);

// --- ROUTE CHỈNH SỬA ---
route.get("/edit/:id", controller.edit);
route.patch(
    "/edit/:id",
    upload.single("hinh_anh"),
    uploadCloud.upload,        // Tự động xử lý nếu có ảnh mới, không có thì bỏ qua
    controller.editpatch
);

// --- ROUTE THAY ĐỔI TRẠNG THÁI & XÓA ---
route.delete("/delete/:id", controller.deleteItem); 
route.patch("/change-hoatdongduan/:is_noibat/:id", controller.changeHoatdong);
route.patch("/change-multi", controller.changeMulti);
// 1. Xem danh sách đã xóa
route.get("/trash", controller.trash);

// 2. Khôi phục dự án
route.patch("/restore/:id", controller.restore);

// 3. Xóa vĩnh viễn khỏi Database
route.delete("/delete-permanently/:id", controller.deletePermanently);
module.exports = route;