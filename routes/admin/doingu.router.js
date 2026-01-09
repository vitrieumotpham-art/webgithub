const express = require('express');
const route = express.Router();
const multer = require("multer");
const upload = multer(); // Chuyển sang Memory Storage
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const DoinguController = require("../../controllers/admin/Doingu.controller");
const validates = require("../../validates/admin/dichvu.validate");

// --- ROUTE CHI TIẾT & DANH SÁCH ---
route.get("/", DoinguController.Doingu);

// --- ROUTE TẠO MỚI ---
route.get("/create", DoinguController.createDoingu);
route.post(
    "/create",
    upload.single("avatar"), 
    uploadCloud.upload,      
    DoinguController.createDoinguPost
);

// --- ROUTE CHỈNH SỬA ---
route.get("/edit/:id", DoinguController.edit);
route.patch(
    "/edit/:id",
    upload.single("avatar"),
    uploadCloud.upload,      
    validates.createPost,   
    DoinguController.editpatch
);

// --- ROUTE XÓA ---
route.delete("/delete/:id", DoinguController.deleteItem); 

module.exports = route;