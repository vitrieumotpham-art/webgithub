const express = require('express');
const route = express.Router();
const DichvuController = require("../../controllers/admin/Dichvu.controller");

route.get("/", DichvuController.Dichvu);
route.patch("/change-hoatdong/:status/:id", DichvuController.changeHoatdong);
route.patch("/change-multi", DichvuController.changeMulti);

module.exports = route;
