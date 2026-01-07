const express = require('express');
const route = express.Router();
const rolesController = require("../../controllers/admin/rolesController.controller");

route.get("/", rolesController.rolesindex);
route.get("/create", rolesController.create);
route.post("/create", rolesController.postcreate);

route.get("/permissions", rolesController.permissions);

route.get("/edit/:id", rolesController.edit);
route.patch("/edit/:id", rolesController.editPatch);

// Trang chi tiết
route.get("/detail/:id", rolesController.detail);

route.patch("/permissions", rolesController.permissionsPatch);

// --- THÊM DÒNG NÀY ĐỂ XỬ LÝ XÓA ---
route.delete("/delete/:id", rolesController.deleteItem);

module.exports = route;