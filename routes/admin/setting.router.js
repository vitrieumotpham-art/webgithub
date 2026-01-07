const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const controller = require("../../controllers/admin/setting.controller");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware"); // Middleware upload ảnh lên Cloudinary

router.get("/general", controller.index);

// Xử lý cập nhật dữ liệu
router.patch(
  "/general",
  upload.single("logo"),       // Xử lý lấy file từ input name="logo"
  uploadCloud.upload,          // Upload lên Cloudinary (nếu có)
  controller.generalPatch
);

module.exports = router;