const express = require("express");
const route=express.Router();
const about_us=require("../../controllers/client/about_us")

route.get("/about_us",about_us.chungtoi);


module.exports=route;