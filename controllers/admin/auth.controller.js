const taikhoan = require("../../models/taikhoan.models");
const Roles=require("../../models/roles.model");
const md5 = require("md5");
const systemConfig = require("../../config/system.js"); // Sửa chính tả sytemcofig
module.exports.login = async (req, res) => {
    // Chỉ redirect nếu thực sự có token hợp lệ (kiểm tra thêm trong middleware)
    if (req.cookies.tokenAdmin) {
        return res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
    } 
    res.render("admin/pages/auth/login", {
        pageTitle: "Trang login",
    });
};
module.exports.loginPost = async (req, res) => {
    const { email, password } = req.body;

    const user = await taikhoan.findOne({
        email: email,
        deleted: false
    });

    // 1. Kiểm tra sự tồn tại của user
    if (!user) {
        console.log("Email không tồn tại");
        return res.redirect(req.get("Referrer") || "/"); // Thêm return
    }

    // 2. Kiểm tra mật khẩu (Lúc này chắc chắn user đã tồn tại)
    if (md5(password) !== user.password) {
        console.log("Sai mật khẩu");
        return res.redirect(req.get("Referrer") || "/"); // Thêm return
    }

    // 3. Kiểm tra trạng thái
    if (user.status !== "active") {
        console.log("Tài khoản đang bị khóa");
        return res.redirect(req.get("Referrer") || "/"); // Thêm return
    }

    // 4. Thành công
    res.cookie("tokenAdmin", user.token);
    return res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
};
module.exports.logout = async (req, res) => {
    res.clearCookie("tokenAdmin");
    res.redirect("/admin/auth/login");
}