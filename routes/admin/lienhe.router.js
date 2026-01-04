const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/Lienhe.controller");

router.get("/", controller.Lienhe);

// Sửa lại cho khớp với Modal: Bỏ :id vì ta sẽ gửi id trong req.body
router.post("/change-status", controller.changeStatus); 

// Thêm route xóa đúng với tên hàm trong controller
router.post("/delete/:id", controller.deleteItem);

module.exports = router;