const express = require('express');
const route = express.Router();
const multer = require("multer");

// KHÔNG dùng storageMulter vì Vercel không cho phép ghi file vào ổ cứng
const upload = multer(); // Chuyển sang Memory Storage

// Import Middleware xử lý đẩy ảnh lên Cloudinary
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

// Import Controller
const DoinguController = require("../../controllers/admin/Doingu.controller");

// Import Validates (Nếu cần)
const validates = require("../../validates/admin/dichvu.validate");

// --- ROUTE CHI TIẾT & DANH SÁCH ---
route.get("/", DoinguController.Doingu);

// --- ROUTE TẠO MỚI ---
route.get("/create", DoinguController.createDoingu);
route.post(
    "/create",
    upload.single("avatar"), // Nhận file avatar từ form
    uploadCloud.upload,      // Middleware đẩy buffer lên Cloudinary
    DoinguController.createDoinguPost
);

// --- ROUTE CHỈNH SỬA ---
route.get("/edit/:id", DoinguController.edit);
route.patch(
    "/edit/:id",
    upload.single("avatar"),
    uploadCloud.upload,      // Tự động cập nhật link ảnh mới vào req.body.avatar
    validates.createPost,    // Validate dữ liệu (nếu có)
    DoinguController.editpatch
);

// --- ROUTE XÓA ---
route.delete("/delete/:id", DoinguController.deleteItem); 

module.exports = route;