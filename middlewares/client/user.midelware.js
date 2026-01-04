const User = require("../../models/user.model");

module.exports.infoUser = async (req, res, next) => {
  if (req.cookies.token) {
    const user = await User.findOne({
      tokenUser: req.cookies.token,
      deleted: false,
      status: "active"
    }).select("-password"); // Bảo mật: không lấy mật khẩu

    if (user) {
      res.locals.user = user; // Biến user này sẽ dùng được trong mọi file .pug
    }
  }
  next();
};