const Cart = require("../../models/cart.model");
const Project = require("../../models/duan.model"); // PHẢI CÓ DÒNG NÀY
module.exports.addpost = async (req, res) => {
    try {
        const duanId = req.params.productId;
        // Đảm bảo quantity luôn là số, nếu không có hoặc sai thì mặc định là 1
        const quantity = parseInt(req.body.quantity) || 1;
        const cartId = req.cookies.cartId;

        // 1. Tìm giỏ hàng hiện tại
        const cartData = await Cart.findOne({ _id: cartId });

        // KIỂM TRA PHỤ: Nếu vì lý do gì đó cartId trong cookie không tồn tại trong DB
        if (!cartData) {
            console.log("Giỏ hàng không tồn tại trong Database");
            return res.redirect("/du-an"); // Hoặc trang thông báo lỗi
        }

        // 2. Kiểm tra xem sản phẩm đã tồn tại trong giỏ chưa
        const existProductInCart = cartData.products.find(
            (item) => item.product_id == duanId
        );

        if (existProductInCart) {
            // Trường hợp 1: Đã tồn tại -> Cộng dồn số lượng
            const newQuantity = existProductInCart.quantity + quantity;

            await Cart.updateOne(
                {
                    _id: cartId,
                    "products.product_id": duanId
                },
                {
                    $set: {
                        "products.$.quantity": newQuantity
                    }
                }
            );
        } else {
            // Trường hợp 2: Chưa tồn tại -> Thêm mới
            const objectCart = {
                product_id: duanId,
                quantity: quantity
            };

            await Cart.updateOne(
                { _id: cartId },
                {
                    $push: { products: objectCart }
                }
            );
        }

        // 3. Phản hồi người dùng
        // Nếu có dùng express-flash: req.flash("success", "Đã thêm vào giỏ hàng");
        res.redirect("back");

    } catch (error) {
        console.log("Lỗi Add To Cart:", error);
        res.redirect("back");
    }
};


module.exports.index = async (req, res) => {
    try {
        const cartId = req.cookies.cartId;

        // Phải dùng đúng tên model đã đăng ký (Project hoặc duan)
        const cart = await Cart.findOne({ _id: cartId }).populate("products.product_id");

        res.render("client/pages/cart/index", {
            pageTitle: "Danh sách yêu thích",
            cart: cart // Truyền biến cart sang Pug
        });
    } catch (error) {
        res.redirect("back");
    }
};
module.exports.delete = async (req, res) => {
    try {
        const cartId = req.cookies.cartId;
        const productId = req.params.productId;

        await Cart.updateOne(
            { _id: cartId },
            {
                $pull: {
                    products: { product_id: productId }
                }
            }
        );

        res.redirect("back");
    } catch (error) {
        console.log("Lỗi xóa dự án:", error);
        res.redirect("back");
    }
};