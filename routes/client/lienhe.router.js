const express = require("express");
const route = express.Router();
const lienhe = require("../../controllers/client/lienhe");

// Trang hiển thị form liên hệ
route.get("/", lienhe.lienhe); // Thường dùng "/" vì app.use đã gọi là /lienhe rồi

// Xử lý gửi form
route.post("/post", lienhe.postContact); 

module.exports = route;