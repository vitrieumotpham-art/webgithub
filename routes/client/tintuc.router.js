const express = require("express");
const route=express.Router();
const tintuc=require("../../controllers/client/tintuc")

route.get("/tintuc",tintuc.tintuc);
route.get("/:slug", tintuc.detail);

module.exports=route;