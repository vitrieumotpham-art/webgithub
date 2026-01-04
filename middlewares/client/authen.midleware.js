const User = require("../../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
  // Nếu không có token trong cookie -> Chưa đăng nhập
  if (!req.cookies.token) {
    res.redirect("/user/login");
    return;
  }

  // Nếu có token, kiểm tra xem user đó có thật trong DB không
  const user = await User.findOne({
    tokenUser: req.cookies.token,
    deleted: false,
    status: "active"
  });

  if (!user) {
    res.redirect("/user/login");
    return;
  }

  // Nếu mọi thứ OK, cho phép đi tiếp vào trang Profile
  next();
};