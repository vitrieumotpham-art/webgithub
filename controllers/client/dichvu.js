const dichvu = require("../../models/dichvu.model");

// [GET] /dichvu
module.exports.dichvu = async (req, res) => {
    try {
        const listDichvu = await dichvu.find({
            deleted: false,
            status: "active"
        }).sort({ position: "desc" });

        res.render("client/pages/dichvu/index.pug", {
            pageTitle: "Dịch vụ thiết kế PNT DECOR",
            dichvus: listDichvu
        });
    } catch (error) {
        console.error("Lỗi trang danh sách dịch vụ:", error);
        res.redirect("/");
    }
};

// [GET] /dichvu/detail/:slug
module.exports.detail = async (req, res) => {
    try {
        const slug = req.params.slug;
        const record = await dichvu.findOne({
            slug: slug,
            status: "active",
            deleted: false
        });

        if (record) {
            res.render("client/pages/dichvu/detail.pug", {
                pageTitle: record.title,
                record: record
            });
        } else {
            res.redirect("/dichvu");
        }
    } catch (error) {
        console.error("Lỗi trang chi tiết dịch vụ:", error);
        res.redirect("/dichvu");
    }
};