const dichvu = require("../../models/dichvu.model");
const searchHelper = require("../../helpers/search.js");
const paginationdichvuHelper = require("../../helpers/pagination.js");

// --- 1. Hàm Xử lý Danh sách Dịch vụ (Dichvu) ---
module.exports.Dichvu = async (req, res) => { // Đổi 'rep' thành 'req'
    try {
        const trangthai = req.query.status;
        let find = {};

        if (trangthai) {
            find.status = trangthai;
        }

        const objectSearch = searchHelper(req.query);
        if (objectSearch.regex) {
            find.title = objectSearch.regex;
        }

        const countdichvu = await dichvu.countDocuments(find);

        let objectPagination = paginationdichvuHelper({
            currentPage: 1,
            limitItem: 6
        },
            req.query,
            countdichvu
        );

        const listDichvu = await dichvu.find(find)
            .sort({ createdAt: "desc" })
            .limit(objectPagination.limitItem)
            .skip(objectPagination.skip);

        res.render("admin/pages/dichvu/index.pug", {
            pageTitle: "Tran quản dịch vụ ",
            PrefixAdmin: "/admin",
            status: trangthai,
            keyword: objectSearch.keyword,
            dichvu: listDichvu,
            pagination: objectPagination,
            url: req.originalUrl // Đã đổi từ rep.originalUrl
        });
        // console.log(find);
    } catch (error) {
        console.log("Lỗi lấy danh sách dự án:", error);
        res.redirect("back");
    }
}

// --- 2. Hàm Thay đổi Trạng thái Đơn lẻ (changeHoatdong) ---
module.exports.changeHoatdong = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    const returnUrl = req.body.returnUrl;

    try {
        await dichvu.updateOne({ _id: id }, { status: status });
    } catch (error) {
        console.error("Lỗi cập nhật trạng thái đơn lẻ:", error);
    }
    
    // Logic chuyển hướng về trang cũ đã chính xác
    if (returnUrl) {
        res.redirect(returnUrl);
    } else {
        res.redirect("/admin/dichvu");
    }
}

// --- 3. Hàm Thay đổi Trạng thái Hàng loạt (changeMulti) ---
module.exports.changeMulti = async (req, res) => {
    try {
        const type = req.body.type;
        const returnUrl = req.body.returnUrl;

        // ĐÃ SỬA LỖI: Chỉ split bằng dấu phẩy
        const ids = req.body.ids.split(","); 
        
        let message = "";

        switch (type) {
            case "active":
                await dichvu.updateMany({ _id: { $in: ids } }, { status: "active" });
                message = `Đã kích hoạt ${ids.length} dịch vụ!`;
                break;
            case "inactive":
                await dichvu.updateMany({ _id: { $in: ids } }, { status: "inactive" });
                message = `Đã dừng ${ids.length} dịch vụ!`;
                break;
            // case "delete-all":
            //     // ...
            //     break;
            default:
                break;
        }

        // Logic chuyển hướng về trang cũ đã chính xác
        if (returnUrl) {
            res.redirect(returnUrl);
        } else {
            res.redirect("/admin/dichvu");
        }
    } catch (error) {
        console.error("Lỗi cập nhật hàng loạt:", error);
        res.redirect("back");
    }
}