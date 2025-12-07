const express = require("express");
const route=express.Router();
const tintuc=require("../../controllers/client/tintuc")

route.get("/tintuc",tintuc.tintuc);


module.exports=route;