const express = require('express');
const route = express.Router();
const PhanhoiController = require("../../controllers/admin/Phanhoi.controller");

route.get("/", PhanhoiController.Phanhoi);

module.exports = route;
