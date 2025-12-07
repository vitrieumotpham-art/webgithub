const express = require("express");
const route=express.Router();
const dichvu=require("../../controllers/client/dichvu")

route.get("/dichvu",dichvu.dichvu);


module.exports=route;