const User = require("../../models/user.model");
const md5 = require("md5");
const generateHelper = require("../../helpers/generate");
const sendMailHelper = require("../../helpers/sendMail");
const ForgotPassword = require("../../models/forgot-password.model");
const Cart = require("../../models/cart.model");
// [GET] /user/register
module.exports.register = (req, res) => {
    res.render("client/pages/user/register", {
        pageTitle: "Đăng ký tài khoản"
    });
};

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
    try {
        const existEmail = await User.findOne({
            email: req.body.email,
            deleted: false
        });

        if (existEmail) {
            console.log("Email đã tồn tại!");
            return res.redirect("back");
        }
        req.body.password = md5(req.body.password);
        // Tạo token định danh duy nhất cho user
        req.body.tokenUser = generateHelper.generateRandomString(30);

        // 3. Lưu vào Database
        const user = new User(req.body);
        await user.save();
        res.cookie("token", user.tokenUser, {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
            httpOnly: true
        });
        if (req.cookies.cartId) {
            await Cart.updateOne({
                _id: req.cookies.cartId
            }, {
                user_id: user.id
            });
        }

        res.redirect("/");

    } catch (error) {
        console.log("Lỗi đăng ký:", error);
        res.redirect("back");
    }
};

// [GET] /user/login
module.exports.login = (req, res) => {
    res.render("client/pages/user/login", {
        pageTitle: "Đăng nhập"
    });
};

// [POST] /user/login
module.exports.loginPost = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        // 1. Tìm user theo email
        const user = await User.findOne({
            email: email,
            deleted: false
        });

        if (!user) {
            console.log("Email không tồn tại!");
            return res.redirect("back");
        }

        // 2. Kiểm tra mật khẩu
        if (md5(password) !== user.password) {
            console.log("Sai mật khẩu!");
            return res.redirect("back");
        }

        // 3. Kiểm tra trạng thái tài khoản
        if (user.status === "inactive") {
            console.log("Tài khoản đang bị khóa!");
            return res.redirect("back");
        }

        // 4. Đăng nhập thành công, lưu token vào cookie
        res.cookie("token", user.tokenUser, {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
            httpOnly: true
        });

        // --- LOGIC GIỎ HÀNG MỚI ---
        const cartId = req.cookies.cartId;

        // Tìm giỏ hàng cũ của User này trong DB dựa trên user.id
        const existCartWithUser = await Cart.findOne({
            user_id: user.id
        });

        if (existCartWithUser) {
            // Nếu User này ĐÃ CÓ giỏ hàng cũ, cho họ dùng lại cái đó
            res.cookie("cartId", existCartWithUser.id, {
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
                httpOnly: true
            });

            // (Tùy chọn) Nếu lúc chưa đăng nhập họ có lỡ thêm vài món vào giỏ tạm, 
            // bạn nên viết thêm logic gộp sản phẩm từ cartId vào existCartWithUser tại đây.
        } else {
            // Nếu User này CHƯA CÓ giỏ hàng gắn với ID, thì lấy giỏ hiện tại gắn ID vào
            if (cartId) {
                await Cart.updateOne({
                    _id: cartId
                }, {
                    user_id: user.id
                });
            }
        }

        res.redirect("/");
    } catch (error) {
        console.log("Lỗi đăng nhập:", error);
        res.redirect("back");
    }
};

// [GET] /user/logout
module.exports.logout = (req, res) => {
    res.clearCookie("token");
    res.clearCookie("cartId");
    res.redirect("/");
};
// [GET] /user/password/forgot
module.exports.forgotPassword = (req, res) => {
    res.render("client/pages/user/forgot-password", {
        pageTitle: "Quên mật khẩu",
    });
};

// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email;
    const user = await User.findOne({
        email: email,
        deleted: false
    });

    if (!user) {
        // Thông báo email không tồn tại
        return res.redirect("back");
    }

    // 1. Tạo OTP
    const otp = generateHelper.generateRandomNumber(6);

    // 2. Lưu vào DB ForgotPassword (như bước trước đã làm)
    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: Date.now() + 180000
    };
    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();

    // 3. Gửi OTP qua email thật
    const subject = "Mã OTP xác thực lấy lại mật khẩu";
    const html = `
        <h3>Hệ thống PNT DECOR</h3>
        <p>Mã OTP xác thực của bạn là: <b style="color: red; font-size: 20px;">${otp}</b></p>
        <p>Mã này có hiệu lực trong 3 phút. Vui lòng không cung cấp mã này cho bất kỳ ai.</p>
    `;

    sendMailHelper.sendMail(email, subject, html);

    res.redirect(`/user/password/otp?email=${email}`);
};

// [GET] /user/password/otp
module.exports.otpPassword = (req, res) => {
    const email = req.query.email;
    res.render("client/pages/user/otp-password", {
        pageTitle: "Nhập mã OTP",
        email: email
    });
};

// [POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
    const {
        email,
        otp
    } = req.body;

    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    });
    if (!result) {
        console.log("Mã OTP không hợp lệ!");
        return res.redirect("back");
    }

    const user = await User.findOne({
        email: email
    });
    res.cookie("tokenUser", user.tokenUser); // Lưu tạm để reset pass

    res.redirect("/user/password/reset");
};

// [GET] /user/password/reset
module.exports.resetPassword = (req, res) => {
    res.render("client/pages/user/reset-password", {
        pageTitle: "Đổi mật khẩu mới",
    });
};

// [POST] /user/password/resetPost
module.exports.resetPasswordPost = async (req, res) => {
    const password = req.body.password;
    const tokenUser = req.cookies.tokenUser;

    await User.updateOne({
        tokenUser: tokenUser
    }, {
        password: md5(password)
    });

    // Xóa cookie tokenUser sau khi đổi mật khẩu xong
    res.clearCookie("tokenUser");

    res.redirect("/user/login");
};

module.exports.profile = async (req, res) => {
    res.render("client/pages/user/profile", {
        pageTitle: "Thông tin cá nhân", // Đã sửa tiêu đề
    });
};