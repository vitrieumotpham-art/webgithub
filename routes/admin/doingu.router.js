const express = require('express');
const route = express.Router();
const DoinguController = require("../../controllers/admin/Doingu.controller");
const multer=require("multer");
const storageMulter=require("../../helpers/storageMuter");
const validates=require("../../validates/admin/dichvu.validate");
const upload=multer({storage:storageMulter()});
route.get("/", DoinguController.Doingu);
route.get("/create", DoinguController.createDoingu);
route.post("/create",
    upload.single("avatar"),
    DoinguController.createDoinguPost

);
route.get("/edit/:id", DoinguController.edit);
route.patch("/edit/:id",
    upload.single("avatar"),
    validates.createPost,
     DoinguController.editpatch);
 route.delete("/delete/:id", DoinguController.deleteItem); 
module.exports = route;
