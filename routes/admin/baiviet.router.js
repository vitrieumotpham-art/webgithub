const express = require('express');
const route = express.Router();
const multer = require("multer");

const upload = multer(); 
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const BaivietController = require("../../controllers/admin/Baiviet.controller");

// --- CÁC ROUTE CƠ BẢN ---
route.get("/", BaivietController.Baiviet);
route.get("/create", BaivietController.createBaiviet);
route.post(
    "/create",
    upload.single("thumbnail"),
    uploadCloud.upload,
    BaivietController.createBaivietPost
);

route.get("/edit/:id", BaivietController.edit);
route.patch(
    "/edit/:id",
    upload.single("thumbnail"),
    uploadCloud.upload,
    BaivietController.editPatch
);

// --- CÁC ROUTE THAY ĐỔI TRẠNG THÁI & XÓA MỀM ---
route.patch("/change-status/:status/:id", BaivietController.changStatus);
route.delete("/delete/:id", BaivietController.deleteItem);

// --- CÁC ROUTE THÙNG RÁC (BỔ SUNG MỚI) ---

// 1. Trang danh sách bài viết đã xóa (Thùng rác)
route.get("/trash", BaivietController.trash);

// 2. Khôi phục bài viết từ thùng rác
route.patch("/restore/:id", BaivietController.restore);

// 3. Xóa vĩnh viễn (Xóa hẳn khỏi Database)
route.delete("/delete-permanently/:id", BaivietController.deletePermanently);

module.exports = route;