const express = require('express');
const route = express.Router();
const HinhanhController = require("../../controllers/admin/Hinhanh.controller");

route.get("/", HinhanhController.Hinhanh);

module.exports = route;
