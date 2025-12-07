const express = require("express");
const route=express.Router();

const home=require("../../../management_products/controllers/client/home.controller");
const about_us=require("../../../management_products/controllers/client/about_us");
const duan=require("../../../management_products/controllers/client/duan");
const khach=require("../../../management_products/controllers/client/khach");
const lienhe=require("../../../management_products/controllers/client/lienhe");
const tintuc=require("../../../management_products/controllers/client/tintuc");
const dichvu=require("../../../management_products/controllers/client/dichvu");
route.get("/",home.home);
route.get("/about_us",about_us.chungtoi);
route.get("/duan",duan.duan);
route.get("/khach",khach.khach);
route.get("/lienhe",lienhe.lienhe);
route.get("/tintuc",tintuc.tintuc);
route.get("/dichvu",dichvu.dichvu);
module.exports=route;   