const express = require('express');
const route = express.Router();
const multer = require("multer");

// 1. Dùng Memory Storage thay vì storageMulter để tránh lỗi Read-only trên Vercel
const upload = multer(); 

// 2. Import Middleware đẩy ảnh lên Cloudinary
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

// 3. Import Controller & Validates
const DichvuController = require("../../controllers/admin/Dichvu.controller");
const validates = require("../../validates/admin/dichvu.validate");

// --- ROUTE DANH SÁCH ---
route.get("/", DichvuController.Dichvu);

// --- ROUTE THAY ĐỔI TRẠNG THÁI ---
route.patch("/change-hoatdong/:status/:id", DichvuController.changeHoatdong);
route.patch("/change-multi", DichvuController.changeMulti);

// --- ROUTE TẠO MỚI ---
route.get("/create", DichvuController.createDichvu);
route.post(
    "/create",
    upload.single("thumbnail"), // Nhận file thumbnail từ form
    uploadCloud.upload,         // Đẩy buffer lên Cloudinary, trả về link trong req.body.thumbnail
    validates.createPost,       // Validate dữ liệu
    DichvuController.createDichvuPost
);

// --- ROUTE CHỈNH SỬA ---
route.get("/edit/:id", DichvuController.edit);
route.patch(
    "/edit/:id",
    upload.single("thumbnail"),
    uploadCloud.upload,         // Tự động xử lý upload nếu có file mới
    validates.createPost,
    DichvuController.editpatch
);

// --- ROUTE CHI TIẾT & XÓA ---
route.get("/detail/:id", DichvuController.detail);    
route.delete("/delete/:id", DichvuController.deleteItem); 

module.exports = route;