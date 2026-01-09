const Cart = require("../../models/cart.model");

module.exports.cartId = async (req, res, next) => {
    try {
        if (!req.cookies.cartId) {
            const cart = new Cart();
            await cart.save();
            const expiresTime = 1000 * 60 * 60 * 24 * 365; // 1 năm
            res.cookie("cartId", cart.id, { expires: new Date(Date.now() + expiresTime) });
            res.locals.miniCart = { totalQuantity: 0 };
        } else {
            // Lấy giỏ hàng từ DB dựa trên cookie
            const cart = await Cart.findOne({ _id: req.cookies.cartId });
            
            if (cart) {
                // Gán trực tiếp vào res.locals để Pug nhận được
                res.locals.miniCart = {
                    totalQuantity: cart.products ? cart.products.length : 0
                };
            } else {
                res.locals.miniCart = { totalQuantity: 0 };
            }
        }
        next();
    } catch (error) {
        console.log("Lỗi Middleware Cart:", error);
        next();
    }
};