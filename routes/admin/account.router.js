const express = require('express');
const route = express.Router();
const AccountController = require("../../controllers/admin/Account.controller");
const multer = require("multer");
const storageMulter = require("../../helpers/storageMuter");

// BƯỚC 1: Hãy tạo file validate riêng cho Account, đừng dùng chung với dichvu
// const validates = require("../../validates/admin/account.validate"); 

const upload = multer({ storage: storageMulter() });

route.get("/", AccountController.Account);
route.get("/create", AccountController.createAccount);

route.post("/create",
    upload.single("avatar"), // Đảm bảo name="avatar" trong file Pug
    // Nếu có validate thì thêm ở đây: validates.createPost,
    AccountController.createAccountPost
);

module.exports = route;