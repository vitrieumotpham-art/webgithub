const express = require("express");
const route = express.Router();
const controller = require("../../controllers/client/dichvu");

// Khớp với module.exports.index
route.get("/", controller.dichvu);

// Khớp với module.exports.detail
route.get("/detail/:slug", controller.detail);

module.exports = route;