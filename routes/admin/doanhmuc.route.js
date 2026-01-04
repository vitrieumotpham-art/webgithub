const express = require("express");
const route = express.Router();

// LƯU Ý: Đã xóa require multer và uploadCloud vì không dùng ảnh nữa
const controller = require("../../controllers/admin/doanhmuc.controller");
const validate = require("../../validates/admin/doanhmuc.validate"); 

// [GET] /admin/doanhmuc/
route.get("/", controller.doanhmuc); 

// [GET] /admin/doanhmuc/create
route.get("/create", controller.create); 

// [POST] /admin/doanhmuc/create
route.post(
    "/create",
    // Đã xóa upload.single và uploadCloud.upload
    validate.createPost,        
    controller.createPost       
);

// [GET] /admin/doanhmuc/edit/:id
route.get("/edit/:id", controller.edit);

// [PATCH] /admin/doanhmuc/edit/:id
route.patch(
  "/edit/:id", 
  // Đã xóa upload.single và uploadCloud.upload
  validate.createPost, 
  controller.editPatch
);

// [PATCH] /admin/doanhmuc/change-status/:status/:id
route.patch("/change-status/:status/:id", controller.changeStatus);

// [DELETE] /admin/doanhmuc/delete/:id
route.delete("/delete/:id", controller.deleteItem); 

module.exports = route;