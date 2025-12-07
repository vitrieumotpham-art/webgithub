const express = require('express');
const route = express.Router();
const LienheController = require("../../controllers/admin/Lienhe.controller");

route.get("/", LienheController.Lienhe);

module.exports = route;
