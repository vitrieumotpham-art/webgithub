const Duan = require("../../models/duan.model");
const BaiViet = require("../../models/baiviet.model");

module.exports.index = async (req, res) => {
    try {
        const keyword = req.query.keyword;
        let resultsDuan = [];
        let resultsBaiViet = [];

        if (keyword) {
            const regex = new RegExp(keyword, "i");

            // 1. Tìm kiếm trong Dự án
            resultsDuan = await Duan.find({
                title: regex, // Hoặc ten_du_an tùy theo Schema của bạn
                deleted: false,
                status: "active"
            });

            // 2. Tìm kiếm trong Bài viết
            resultsBaiViet = await BaiViet.find({
                title: regex,
                deleted: false,
                status: "active"
            });
        }

        // Xử lý slug dự phòng cho Bài viết (nếu cần)
        const updatedBaiViet = resultsBaiViet.map(item => {
            const article = item.toObject();
            article.slugLink = article.slug || article._id;
            return article;
        });

        res.render("client/pages/search/index.pug", {
            pageTitle: "Kết quả tìm kiếm",
            keyword: keyword,
            duan: resultsDuan,
            articles: updatedBaiViet
        });

    } catch (error) {
        console.log("Lỗi tìm kiếm tổng hợp:", error);
        res.redirect("back");
    }
};