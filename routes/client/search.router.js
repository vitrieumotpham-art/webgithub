const express = require("express");
const route=express.Router();
const search=require("../../controllers/client/search");

route.get("/",search.index);
// route.get("/:slug", search.detail);

module.exports=route;