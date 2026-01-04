
const account = require("../../models/taikhoan.models");
const md5 = require("md5");
const PefixAdmin = require("../../config/system.js"); // Sửa chính tả sytemcofig
module.exports.index= async (req,res) => {
res.render("admin/pages/my-account/index", {
 pageTitle:"thông tin cá nhân",
});
}
module.exports.edit = async (req, res) => {
  res.render("admin/pages/my-account/edit", {
    pageTitle: "Chỉnh sửa thông tin cá nhân",
  });
};

// [PATCH] /admin/my-account/edit
module.exports.editPatch = async (req, res) => {
  const id = res.locals.user.id; // Lấy ID của user đang đăng nhập từ middleware

  // 1. Kiểm tra email đã tồn tại chưa (trừ email của chính mình)
  const emailExist = await account.findOne({
    _id: { $ne: id }, // $ne: Not Equal (không so sánh với chính mình)
    email: req.body.email,
    deleted: false
  });

  if (emailExist) {
    req.flash("error", `Email ${req.body.email} đã tồn tại trong hệ thống!`);
    res.redirect("back");
    return;
  }

  // 2. Xử lý mật khẩu
  // Nếu người dùng nhập mật khẩu mới thì mới mã hóa và lưu
  if (req.body.password) {
    req.body.password = md5(req.body.password);
  } else {
    // Nếu để trống thì xóa trường password khỏi object req.body để không ghi đè mật khẩu cũ
    delete req.body.password;
  }

  // 3. Xử lý ảnh đại diện (Avatar)
  // Nếu bạn dùng middleware upload Cloudinary (như multer-cloudinary), 
  // đường dẫn ảnh sẽ nằm trong req.body.avatar (do middleware gán vào)
  
  try {
    await account.updateOne({ _id: id }, req.body);
    req.flash("success", "Cập nhật thông tin tài khoản thành công!");
  } catch (error) {
    req.flash("error", "Có lỗi xảy ra trong quá trình cập nhật!");
  }

  res.redirect(`/${PefixAdmin.prefixAdmin}/my-account`);
};