const express = require('express');
const route = express.Router();
const AccountController = require("../../controllers/admin/Account.controller");
const multer = require("multer");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

const upload = multer();

route.get("/", AccountController.Account);
route.get("/create", AccountController.createAccount);

// [POST] Tạo tài khoản mới
route.post("/create",
    upload.single("avatar"), // "avatar" phải khớp với name trong file PUG
    uploadCloud.upload,
    AccountController.createAccountPost
);

route.get("/edit/:id", AccountController.edit);

// [PATCH] Cập nhật tài khoản
route.patch(
    "/edit/:id",
    upload.single("avatar"),
    uploadCloud.upload,
    AccountController.editPatch
);

route.delete("/delete/:id", AccountController.deleteItem); 
route.patch("/change-status/:status/:id", AccountController.changeStatus);

module.exports = route;