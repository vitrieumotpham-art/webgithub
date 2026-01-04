const express = require("express");
const route=express.Router();
const duan=require("../../controllers/client/duan")

route.get("/",duan.duan);
route.get("/:slug",duan.detail);

module.exports=route;