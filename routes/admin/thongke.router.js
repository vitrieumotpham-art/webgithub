const express = require("express");
const router = express.Router();

// Import controller (Giả sử bạn đặt tên file xử lý là thongke.controller.js)
const controller = require("../../controllers/admin/thongke.controller");

// Route chính: /admin/thongke
// Phương thức: GET
router.get("/", controller.index);

// Nếu sau này bạn muốn lọc thống kê theo ngày tháng, có thể thêm:
// router.get("/filter", controller.filterByDate);

module.exports = router;