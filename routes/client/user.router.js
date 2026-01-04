const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/user.controller");

// Kiểm tra kỹ tên file này có đúng là authen.midleware không nhé
const authMiddleware = require("../../middlewares/client/authen.midleware");

// --- Tài khoản ---
router.get("/register", controller.register);
router.post("/register", controller.registerPost);

router.get("/login", controller.login);
router.post("/login", controller.loginPost);

router.get("/logout", controller.logout);

// --- Quên mật khẩu ---
router.get("/password/forgot", controller.forgotPassword);
router.post("/password/forgot", controller.forgotPasswordPost);

router.get("/password/otp", controller.otpPassword);
router.post("/password/otp", controller.otpPasswordPost);

router.get("/password/reset", controller.resetPassword);
router.post("/password/reset", controller.resetPasswordPost);

// --- Thông tin cá nhân (Phải đặt middleware ở đây để bảo vệ dữ liệu) ---
router.get("/profile", authMiddleware.requireAuth, controller.profile);

module.exports = router;