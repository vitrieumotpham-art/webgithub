const taikhoan = require("../../models/taikhoan.models");
const mongoose = require("mongoose");
const systemConfig = require("../../config/system.js");
const Roles = require("../../models/roles.model");

module.exports.requireAuth = async (req, res, next) => {
    try {
        // 1. Kiểm tra sự tồn tại của cookie tokenAdmin
        if (!req.cookies.tokenAdmin) {
            return res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
        }

        // 2. Tìm tài khoản dựa trên tokenAdmin
        const user = await taikhoan.findOne({
            token: req.cookies.tokenAdmin,
            deleted: false
        }).select("-password");

        if (!user) {
            res.clearCookie("tokenAdmin");
            return res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
        }

        // 3. Lấy thông tin quyền (Roles)
        if (user.role && mongoose.Types.ObjectId.isValid(user.role)) {
            const role = await Roles.findOne({
                _id: user.role,
                deleted: false
            }).select("title permissions");
            
            res.locals.role = role;
        }

        // 4. Gán user vào locals
        res.locals.user = user;
        res.locals.path = req.originalUrl; 
        
        next();
    } catch (error) {
        console.error("Lỗi Middleware Auth Admin:", error);
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
    }
}