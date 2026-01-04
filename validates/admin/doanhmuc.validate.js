const systemConfig = require("../../config/system");

module.exports.createPost = (req, res, next) => {
    // 1. Kiểm tra tiêu đề trống
    if (!req.body.title) {
        req.flash("error", "Vui lòng nhập tiêu đề danh mục!");
        res.redirect("back"); // Quay lại trang cũ (dù là create hay edit)
        return;
    }

    // 2. Kiểm tra độ dài tiêu đề
    // Lưu ý: Thường danh mục chỉ cần 3-5 ký tự là đủ, 8 có thể hơi dài
    if (req.body.title.length < 5) {
        req.flash("error", "Tiêu đề danh mục phải có ít nhất 5 ký tự!");
        res.redirect("back");
        return;
    }

    next();
};