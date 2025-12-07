const express = require('express');
const route = express.Router();
const controller = require("../../controllers/admin/Projects.controller"); 
route.get("/", controller.duan); 
route.get("/change-noibat/:is_noibat/:id", controller.changeStatus); 
module.exports = route;