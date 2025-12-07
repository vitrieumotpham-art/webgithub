const express = require('express');
const route = express.Router();
const BaivietController = require("../../controllers/admin/Baiviet.controller");

route.get("/", BaivietController.Baiviet);
route.patch("/change-status/:status/:id", BaivietController.changStatus);
module.exports = route;
