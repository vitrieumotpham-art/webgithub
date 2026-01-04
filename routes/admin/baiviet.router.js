const express = require('express');
const route = express.Router();
const multer = require("multer");

// 1. Dùng Memory Storage để tránh lỗi Read-only trên Vercel
const upload = multer(); 

// 2. Import Middleware đẩy ảnh lên Cloudinary
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const BaivietController = require("../../controllers/admin/Baiviet.controller");
const validates = require("../../validates/admin/dichvu.validate"); 
route.get("/", BaivietController.Baiviet);
route.patch("/change-status/:status/:id", BaivietController.changStatus);
route.get("/create", BaivietController.createBaiviet);
route.post(
    "/create",
    upload.single("thumbnail"), // Lưu ý: Trong Controller của bạn đang dùng req.body.avatar
    uploadCloud.upload,       // Đẩy buffer lên Cloudinary
    BaivietController.createBaivietPost
);

// [GET] Trang chỉnh sửa
route.get("/edit/:id", BaivietController.edit);

// [PATCH] Xử lý cập nhật bài viết
route.patch(
    "/edit/:id",
    upload.single("thumbnail"), // Lưu ý: Tên field phải khớp với file PUG và Controller
    uploadCloud.upload,
    BaivietController.editPatch
);

// [DELETE] Xóa bài viết
route.delete("/delete/:id", BaivietController.deleteItem);

module.exports = route;