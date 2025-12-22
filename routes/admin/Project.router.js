const express = require('express');
const route = express.Router();
const multer = require("multer");
const storageMulter = require("../../helpers/storageMuter");
const upload = multer({ storage: storageMulter() });

// Import controller (Đảm bảo đường dẫn này đúng)
const controller = require("../../controllers/admin/Projects.controller"); 

// --- ROUTE CHI TIẾT & DANH SÁCH ---
route.get("/", controller.duan); 
route.get("/detail/:id", controller.detail); 

// --- ROUTE TẠO MỚI ---
route.get("/create", controller.createduan);
route.post("/create", 
    upload.single("hinh_anh"),
    // validates.createPost, <-- Nếu dòng này gây lỗi, hãy tạm comment lại như thế này
    controller.createduanPost
);

// --- ROUTE CHỈNH SỬA ---
route.get("/edit/:id", controller.edit);
route.patch("/edit/:id",
    upload.single("hinh_anh"),
    controller.editpatch
);

// --- ROUTE THAY ĐỔI TRẠNG THÁI & XÓA ---
route.delete("/delete/:id", controller.deleteItem); 
route.patch("/change-hoatdongduan/:is_noibat/:id", controller.changeHoatdong);
route.patch("/change-multi", controller.changeMulti);

module.exports = route;