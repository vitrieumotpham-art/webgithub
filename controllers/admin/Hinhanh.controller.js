const baiviet = require("../../models/thuvien.model");

module.exports.Hinhanh = async (req, res) => { // Lưu ý: tham số thường là req, res (bạn đang để rep)
    try {
        // 1. LOGIC LẤY DANH SÁCH (Bị ảnh hưởng bởi ?type=...)
        let find = {};
        const typeThuvien = req.query.type;
        
        if (typeThuvien) {
            find.type = typeThuvien;
        }

        const listThuvien = await baiviet.find(find);

        // 2. LOGIC ĐẾM SỐ LƯỢNG CHO DASHBOARD (Luôn đếm toàn bộ DB)
        // Dùng Promise.all để chạy 3 lệnh đếm cùng lúc cho nhanh
        const [countImage, countVideo, countDocument] = await Promise.all([
            baiviet.countDocuments({ type: 'image' }),
            baiviet.countDocuments({ type: 'video' }),
            baiviet.countDocuments({ type: 'document' }) // Hoặc { type: { $nin: ['image', 'video'] } } nếu muốn đếm các loại còn lại
        ]);

        res.render("admin/pages/hinhanh/index.pug", {
            pageTitle: "Trang quản lí hình ảnh",
            PrefixAdmin: "/admin",
            thuvien: listThuvien,
            // Truyền object chứa 3 số liệu riêng biệt
            thongke: {
                image: countImage,
                video: countVideo,
                document: countDocument
            }
        });

    } catch (error) {
        console.log("Lỗi lấy danh sách dự án:", error);
        res.redirect("back");
    }
}