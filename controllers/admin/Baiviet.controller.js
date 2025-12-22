const baiviet = require("../../models/baiviet.model");
const searchHelper = require("../../helpers/search.js");
const paginationbaivietHelper = require("../../helpers/pagination.js");
const mongoose = require('mongoose');
const systemConfig = require("../../config/system.js"); // Sửa chính tả sytemcofig
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
  limitItem:8},
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
            pagination: objectPagination,
            url: req.originalUrl
        });

    } catch (error) {
        console.log("Lỗi lấy danh sách bài viết:", error);
        res.redirect("back");
    }
};
module.exports.changStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    // LẤY URL CHUYỂN HƯỚNG TỪ FORM ẨN (JavaScript đã gửi)
    const returnUrl = req.body.returnUrl; 

    try {
        // Cập nhật Database
        await baiviet.updateOne({ _id: id }, { status: status });
        // (Khuyến nghị: Thêm thông báo flash tại đây)

    } catch (error) {
        console.error("Lỗi cập nhật trạng thái bài viết:", error);
    }
    
    // LOGIC CHUYỂN HƯỚNG:
    if (returnUrl) {
        // Chuyển hướng về URL đầy đủ (có ?page=X&status=Y)
        res.redirect(returnUrl); 
    } else {
        // Chuyển hướng dự phòng về trang đầu tiên
        res.redirect("/admin/baiviet");
    }
}
module.exports.createBaiviet = async(req,res)=>{
    res.render("admin/pages/baiviet/create.pug",{
        pageTitle:"thêm mới sản phẩm"
    });
} 
module.exports.createBaivietPost = async (req, res) => {
    // 1. Xử lý views
    req.body.views = req.body.views ? parseInt(req.body.views) : 0;

    // 2. Xử lý position
    if (req.body.position === "" || !req.body.position) {
        try {
            const countBaiviet = await baiviet.countDocuments({ deleted: false }); 
            req.body.position = countBaiviet + 1;
        } catch (error) {
            req.body.position = 1;
        }
    } else {
        req.body.position = parseInt(req.body.position);
    }

    // 3. Xử lý thumbnail
    if (req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    // 4. Xử lý featured (Checkbox sang Boolean)
    req.body.featured = req.body.featured === "true";

    // 5. Gán thông tin người tạo
    if(res.locals.user) {
        req.body.createdBy = {
            account_id: res.locals.user.id
        };
    }

    try {
        const newBaiviet = new baiviet(req.body); 
        await newBaiviet.save(); 
        
        // Sửa lại redirect có dấu / và prefix
        res.redirect(`/${systemConfig.prefixAdmin}/baiviet`);
    } catch (error) {
        console.error("Lỗi khi lưu bài viết:", error);
        res.redirect(`/${systemConfig.prefixAdmin}/baiviet`);
    }
}
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    const returnUrl = decodeURIComponent(req.query.returnUrl || "/admin/baiviet");
    
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            req.flash("error", "ID dự án không hợp lệ.");
            return res.redirect(returnUrl);
        }
        
        const result = await baiviet.updateOne({ _id: id }, { 
            deleted: true,
            deletedAt: new Date()
        });

        if (result.matchedCount === 0) {
             req.flash("error", "Không tìm thấy dự án để xóa.");
             return res.redirect(returnUrl);
        }
        
        req.flash("success", "Xóa dự án thành công!");
        res.redirect(returnUrl);
        
    } catch (error) {
        console.error("Lỗi xóa dự án:", error);
        req.flash("error", "Xóa dự án thất bại. Vui lòng thử lại.");
        res.redirect("/admin/baiviet");
    }
};
// ===================================
// [GET] /admin/baiviet/edit/:id
// ===================================
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;

        // Kiểm tra ID hợp lệ
        if (!mongoose.Types.ObjectId.isValid(id)) {
            req.flash("error", "ID bài viết không hợp lệ.");
            return res.redirect(`/${systemConfig.prefixAdmin}/baiviet`);
        }

        // Tìm bài viết theo ID và chưa bị xóa
        const record = await baiviet.findOne({
            _id: id,
            deleted: false
        });

        if (!record) {
            req.flash("error", "Không tìm thấy bài viết này.");
            return res.redirect(`/${systemConfig.prefixAdmin}/baiviet`);
        }

        res.render("admin/pages/baiviet/edit.pug", {
            pageTitle: "Chỉnh sửa bài viết",
            baiviet: record
        });

    } catch (error) {
        console.error("Lỗi trang chỉnh sửa:", error);
        res.redirect(`/${systemConfig.prefixAdmin}/baiviet`);
    }
};

// ===================================
// [PATCH] /admin/baiviet/edit/:id
// ===================================
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    try {
        // 1. Xử lý các trường dữ liệu số
        if (req.body.position) {
            req.body.position = parseInt(req.body.position);
        }
        if (req.body.views) {
            req.body.views = parseInt(req.body.views);
        }

        // 2. Xử lý hình ảnh mới (nếu có upload)
        if (req.file) {
            req.body.thumbnail = `/uploads/${req.file.filename}`;
        }

        // 3. Xử lý featured (Checkbox)
        req.body.featured = req.body.featured === "true";

        // 4. Cập nhật thông tin người sửa (Tùy chọn)
        if (res.locals.user) {
            req.body.updatedBy = {
                account_id: res.locals.user.id,
                updatedAt: new Date()
            };
        }

        // 5. Thực hiện cập nhật vào DB
        await baiviet.updateOne({ _id: id }, req.body);

        req.flash("success", "Cập nhật bài viết thành công!");
        res.redirect(`/${systemConfig.prefixAdmin}/baiviet`);

    } catch (error) {
        console.error("Lỗi khi cập nhật bài viết:", error);
        req.flash("error", "Cập nhật thất bại. Vui lòng thử lại.");
        res.redirect("back");
    }
};