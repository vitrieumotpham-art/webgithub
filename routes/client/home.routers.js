const express = require("express");
const route = express.Router();

// Sửa lại đường dẫn lùi 2 cấp (../../) để vào thẳng thư mục controllers
const home = require("../../controllers/client/home.controller");
const about_us = require("../../controllers/client/about_us");
const duan = require("../../controllers/client/duan");
const khach = require("../../controllers/client/khach");
const lienhe = require("../../controllers/client/lienhe");
const tintuc = require("../../controllers/client/tintuc");
const dichvu = require("../../controllers/client/dichvu");

route.get("/", home.home);
route.get("/about_us", about_us.chungtoi);
route.get("/duan", duan.duan);
route.get("/khach", khach.khach);
route.get("/lienhe", lienhe.lienhe);
route.get("/tintuc", tintuc.tintuc);
route.get("/dichvu", dichvu.dichvu);

module.exports = route;