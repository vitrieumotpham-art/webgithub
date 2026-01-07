const taikhoan = require("../../models/taikhoan.models");
const Roles=require("../../models/roles.model");
const md5 = require("md5");
const systemConfig = require("../../config/system.js"); 
module.exports.login = async (req, res) => {
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

    if (!user) {
        console.log("Email không tồn tại");
        return res.redirect(req.get("Referrer") || "/");
    }

    if (md5(password) !== user.password) {
        console.log("Sai mật khẩu");
        return res.redirect(req.get("Referrer") || "/"); 
    }

    if (user.status !== "active") {
        console.log("Tài khoản đang bị khóa");
        return res.redirect(req.get("Referrer") || "/"); 
    }

    res.cookie("tokenAdmin", user.token);
    return res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
};
module.exports.logout = async (req, res) => {
    res.clearCookie("tokenAdmin");
    res.redirect("/admin/auth/login");
}