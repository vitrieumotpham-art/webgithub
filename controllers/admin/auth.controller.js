const taikhoan = require("../../models/taikhoan.models");
const md5 = require("md5");
const systemConfig = require("../../config/system.js");

// [GET] /admin/auth/login
module.exports.login = async (req, res) => {
    if (req.cookies.tokenAdmin) {
        return res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
    }
    res.render("admin/pages/auth/login", {
        pageTitle: "Trang đăng nhập",
    });
};

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
    const { email, password } = req.body;

    const user = await taikhoan.findOne({
        $or: [{ email: email }, { username: email }],
        deleted: false
    });

    if (!user) {
        console.log("Email hoặc tài khoản không tồn tại");
        return res.redirect("back");
    }

    if (md5(password.trim()) !== user.password) {
        console.log("Sai mật khẩu");
        return res.redirect("back");
    }

    if (user.status !== "active") {
        console.log("Tài khoản đang bị khóa");
        return res.redirect("back");
    }

    res.cookie("tokenAdmin", user.token);
    return res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
};

// [GET] /admin/auth/logout
module.exports.logout = async (req, res) => {
    res.clearCookie("tokenAdmin");
    res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
};