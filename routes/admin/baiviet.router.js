const express = require('express');
const route = express.Router();
const BaivietController = require("../../controllers/admin/Baiviet.controller");
const multer = require("multer");
const storageMulter = require("../../helpers/storageMuter");
const validates = require("../../validates/admin/dichvu.validate"); // Lưu ý kiểm tra lại tên file validate này
const upload = multer({ storage: storageMulter() });

// [GET] Danh sách bài viết
route.get("/", BaivietController.Baiviet);

// [PATCH] Thay đổi trạng thái
route.patch("/change-status/:status/:id", BaivietController.changStatus);

// [GET] Trang tạo mới
route.get("/create", BaivietController.createBaiviet);

// [POST] Xử lý tạo mới
route.post(
    "/create",
    upload.single("thumbnail"),
    BaivietController.createBaivietPost
);

// [GET] Trang chỉnh sửa
route.get("/edit/:id", BaivietController.edit);

// [PATCH] Xử lý cập nhật bài viết (PHẦN BỔ SUNG)
route.patch(
    "/edit/:id",
    upload.single("thumbnail"),
    BaivietController.editPatch
);

// [DELETE] Xóa bài viết
route.delete("/delete/:id", BaivietController.deleteItem);

module.exports = route;