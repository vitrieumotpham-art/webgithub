const duan = require("../../models/duan.model");

module.exports.duan = async (req, res) => {
    try {
        // CHỈ ĐỂ DUY NHẤT ĐIỀU KIỆN DELETED
        // Để chắc chắn mọi dự án đều hiện ra trước đã
        const find = {
            deleted: false
        };

        const duans = await duan.find(find).sort({ createdAt: -1 });

        // Debug: Kiểm tra xem Database trả về bao nhiêu con số
        // Bạn nhìn vào màn hình đen (Terminal/CMD) lúc chạy code sẽ thấy số này
        console.log("Số lượng dự án trong DB:", duans.length);

        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));

        const updatedDuans = duans.map(item => {
            const project = item.toObject();
            project.is_new = project.createdAt >= sevenDaysAgo;
            return project;
        });

        res.render("client/pages/du_an/index.pug", {
            pageTitle: "Dự Án Đã Thực Hiện - PNT DECOR",
            duan: updatedDuans
        });

    } catch (error) {
        console.log("Lỗi:", error);
        res.redirect("/"); 
    }
};
module.exports.detail = async (req, res) => {
    try {
        const slug = req.params.slug;
        const project = await duan.findOne({
            slug: slug,
            deleted: false,
            // trang_thai: "active"
        });

        if (!project) {
            return res.redirect("/duan");
        }

        res.render("client/pages/du_an/detail.pug", {
            pageTitle: project.ten_du_an,
            project: project
        });
    } catch (error) {
        res.redirect("/duan");
    }
};