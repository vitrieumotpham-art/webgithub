const express = require('express');
const route = express.Router();
const auth = require("../../controllers/admin/auth.controller");

route.get("/login", auth.login);
route.post("/login", auth.loginPost);
route.get("/logout", auth.logout);
// route.get("/create", auth.create);
// route.post("/create", auth.postcreate);

// route.get("/permissions", auth.permissions);

// route.get("/edit/:id", auth.edit);
// route.patch("/edit/:id", auth.editPatch);
// route.patch("/edit/:id", auth.editPatch);
// // Trang chi tiết
// route.get("/detail/:id", auth.detail);
// route.patch("/permissions", auth.permissionsPatch);
module.exports = route;
