const baiviet = require("../../models/baiviet.model");
const searchHelper = require("../../helpers/search.js");
const paginationbaivietHelper = require("../../helpers/pagination.js");
//admin/Baiviet
module.exports.Baiviet = async (req, res) => {
    try {
        let find = {
            deleted: false // (Nên thêm: Thường ta chỉ lấy các bài chưa bị xóa)
        };

        // 1. Xử lý bộ lọc trạng thái (Status)
        const trangthai = req.query.status;
        if (trangthai) {
            find.status = trangthai;
        }
        const objectSearch = searchHelper(req.query);
        if (objectSearch.regex) {
            find.title = objectSearch.regex;
        }
            const countbaiviet = await baiviet.countDocuments(find);
let objectPagination = paginationbaivietHelper({
  currentPage:1,
  limitItem:10},
  req.query,
  countbaiviet
)   
        // 3. Bây giờ mới gọi Database để lấy dữ liệu với bộ lọc đầy đủ
        const listBaiViet = await baiviet.find(find).sort({ createdAt: "desc" }).limit(objectPagination.limitItem). skip(objectPagination.skip);

        // 4. Trả về giao diện
        res.render("admin/pages/baiviet/index.pug", {
            pageTitle: "Trang quản lý bài viết",
            baiviet: listBaiViet,
            status: trangthai,
            keyword: objectSearch.keyword,
            pagination: objectPagination
        });

    } catch (error) {
        console.log("Lỗi lấy danh sách bài viết:", error);
        res.redirect("back");
    }
};
//admin/Baiviet/change-status/:status/:id
module.exports.changStatus = async (req, res)=>{
    const status = req.params.status;
    const id = req.params.id;
    await baiviet.updateOne({_id: id},{status:status});
    res.redirect("/admin/baiviet");
}