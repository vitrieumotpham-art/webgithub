const express = require("express");
const route=express.Router();
const lienhe=require("../../controllers/client/lienhe")

route.get("/lienhe",lienhe.lienhe);


module.exports=route;