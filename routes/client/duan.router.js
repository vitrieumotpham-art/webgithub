const express = require("express");
const route=express.Router();
const duan=require("../../controllers/client/duan")

route.get("/duan",duan.duan);


module.exports=route;