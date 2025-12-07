const express = require('express');
const route = express.Router();
const DoinguController = require("../../controllers/admin/Doingu.controller");

route.get("/", DoinguController.Doingu);

module.exports = route;
