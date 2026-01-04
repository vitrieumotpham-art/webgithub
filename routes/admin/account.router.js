const express = require('express');
const route = express.Router();
const AccountController = require("../../controllers/admin/Account.controller");
const multer = require("multer");
const storageMulter = require("../../helpers/storageMuter");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
// BƯỚC 1: Hãy tạo file validate riêng cho Account, đừng dùng chung với dichvu
// const validates = require("../../validates/admin/account.validate"); 

const upload = multer();

route.get("/", AccountController.Account);
route.get("/create", AccountController.createAccount);
route.get("/edit/:id", AccountController.edit);

// [PATCH] Xử lý cập nhật bài viết
route.patch(
    "/edit/:id",
    upload.single("avatar"), // Lưu ý: Tên field phải khớp với file PUG và Controller
    uploadCloud.upload,
    AccountController.editPatch
);
route.post("/create",
    upload.single("avatar"), // Đảm bảo name="avatar" trong file Pug
     uploadCloud.upload,
    AccountController.createAccountPost
);
// route.delete("/delete/:id", AccountController.deleteItem); 

module.exports = route;