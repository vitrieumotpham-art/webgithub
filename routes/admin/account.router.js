const express = require('express');
const route = express.Router();
const AccountController = require("../../controllers/admin/Account.controller");

route.get("/", AccountController.Account);

module.exports = route;
