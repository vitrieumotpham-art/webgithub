const Contact = require("../../models/lienhe.model");

// [GET] /lienhe
module.exports.lienhe = (req, res) => {
    res.render("client/pages/lienhe/index.pug", {
        pageTitle: "Liên hệ - PNT DECOR"
    });
};

// [POST] /lienhe/post
module.exports.postContact = async (req, res) => {
    try {
        const newContact = new Contact({
            fullName: req.body.fullName,
            email: req.body.email,
            phone: req.body.phone,
            message: req.body.message,
            status: "Chờ xử lý"
        });

        await newContact.save();
        
        // Thêm thông báo thành công
        req.flash("success", "Gửi yêu cầu thành công! Chúng tôi sẽ liên hệ sớm.");
        res.redirect("back");
    } catch (error) {
        console.log("Lỗi gửi liên hệ:", error);
        req.flash("error", "Gửi thất bại, vui lòng kiểm tra lại thông tin.");
        res.redirect("back");
    }
};