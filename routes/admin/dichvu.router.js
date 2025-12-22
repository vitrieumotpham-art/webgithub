const express = require('express');
const route = express.Router();
const DichvuController = require("../../controllers/admin/Dichvu.controller");
const multer=require("multer");
const storageMulter=require("../../helpers/storageMuter");
const validates=require("../../validates/admin/dichvu.validate");
const upload=multer({storage:storageMulter()});

route.get("/", DichvuController.Dichvu);
route.patch("/change-hoatdong/:status/:id", DichvuController.changeHoatdong);
route.patch("/change-multi", DichvuController.changeMulti);
route.get("/create", DichvuController.createDichvu);
route.post("/create",
    upload.single("thumbnail"),
    validates.createPost,
    DichvuController.createDichvuPost

);
route.get("/edit/:id", DichvuController.edit);
route.patch("/edit/:id",
    upload.single("thumbnail"),
    validates.createPost,
     DichvuController.editpatch);
 route.get("/detail/:id", DichvuController.detail);    
 route.delete("/delete/:id", DichvuController.deleteItem); 
module.exports = route;
