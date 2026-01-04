const express = require('express');
const router = express.Router();
const multer = require('multer'); // Thư viện xử lý dữ liệu form-data (file)

const myaccount = require("../../controllers/admin/my-account.controller");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware"); // Middleware upload lên Cloudinary của bạn

const upload = multer(); // Khởi tạo multer

// [GET] /admin/my-account
router.get("/", myaccount.index);

// [GET] /admin/my-account/edit
router.get("/edit", myaccount.edit);

// [PATCH] /admin/my-account/edit
// upload.single('avatar'): Tên của input file trong file edit.pug
// uploadCloud.upload: Hàm xử lý đẩy ảnh lên Cloudinary
router.patch(
    "/edit", 
    upload.single("avatar"), 
    uploadCloud.upload, 
    myaccount.editPatch
);

module.exports = router;