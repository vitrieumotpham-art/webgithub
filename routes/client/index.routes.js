const chungtoi = require("./about_us.routes");
const productHome = require("./home.routers.js");
const duan = require("./duan.router.js");
const khach = require("./khach.router.js");
const lienhe = require("./lienhe.router.js");
const tintuc = require("./tintuc.router.js");
const dichvu = require("./dichvu.router.js");
const search = require("./search.router.js");
const cart = require("./cart.router.js"); 
const user = require("./user.router.js"); 

// Kiểm tra kỹ tên file middleware trong thư mục thực tế của bạn
const cartMiddleware = require("../../middlewares/client/cart.midelware.js");
const userMiddleware = require("../../middlewares/client/user.midelware.js");

module.exports = (app) => {
    // 1. Chạy các middleware toàn cục trước
    app.use(cartMiddleware.cartId);     // Tạo giỏ hàng tạm cho khách
    app.use(userMiddleware.infoUser);   // Kiểm tra đăng nhập để hiện menu User

    // 2. Định nghĩa các tuyến đường (Routes)
    app.use("/", productHome);
    app.use("/about_us", chungtoi);
    app.use("/duan", duan);
    app.use("/khach", khach);
    app.use("/lienhe", lienhe);
    app.use("/tintuc", tintuc);
    app.use("/dichvu", dichvu);
    app.use("/search", search);
    app.use("/cart", cart); 
    app.use("/user", user); 
}