const express = require('express');
const route = express.Router();
const auth = require("../../controllers/admin/auth.controller");

route.get("/login", auth.login);
route.post("/login", auth.loginPost);
route.get("/logout", auth.logout);

module.exports = route;
