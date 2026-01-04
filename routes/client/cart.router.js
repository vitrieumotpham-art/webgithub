const express = require("express");
const router = express.Router();
const controller=require("../../controllers/client/cart")

// PHẢI LÀ :productId (khớp với Controller)
router.get("/", controller.index);
router.post("/add/:productId", controller.addpost);
router.get("/delete/:productId", controller.delete);
module.exports = router;
