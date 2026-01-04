const BaiViet = require("../../models/baiviet.model");

// Hiển thị danh sách bài viết
module.exports.tintuc = async (req, res) => {
    try {
        const find = {
            deleted: false,
            status: "active"
        };

        const articles = await BaiViet.find(find).sort({
            position: "asc",
            createdAt: -1
        });

        console.log("Số lượng bài viết lấy được:", articles.length);

        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));

        const updatedArticles = articles.map(item => {
            const article = item.toObject();

            // Nếu không có slug, lấy tạm ID để tránh lỗi undefined trên URL
            article.slugLink = article.slug ? article.slug : article._id;

            const dateObj = article.createdAt ? new Date(article.createdAt) : new Date();
            article.dateFormat = dateObj.toLocaleDateString('vi-VN');
            article.is_new = dateObj >= sevenDaysAgo;

            return article;
        });

        res.render("client/pages/tintuc/index.pug", {
            pageTitle: "Tin Tức & Kiến Thức - PNT DECOR",
            articles: updatedArticles
        });

    } catch (error) {
        console.log("Lỗi Controller Tin Tức:", error);
        res.redirect("/");
    }
};
module.exports.detail = async (req, res) => {
    try {
        const slug = req.params.slug;

        // 1. Tìm theo slug trước
        let article = await BaiViet.findOne({
            slug: slug,
            deleted: false,
            status: "active"
        });

        // 2. Nếu không thấy slug, kiểm tra xem slug có phải là ID không và tìm theo ID
        if (!article && slug.match(/^[0-9a-fA-F]{24}$/)) {
            article = await BaiViet.findById(slug);
        }

        if (!article) return res.redirect("/tintuc");

        // Xử lý dữ liệu và render bình thường...
        res.render("client/pages/tintuc/detail.pug", { article });
    } catch (error) {
        res.redirect("/tintuc");
    }
};