const express = require("express");
const route=express.Router();
const khach=require("../../controllers/client/khach")

route.get("/khach",khach.khach);


module.exports=route;