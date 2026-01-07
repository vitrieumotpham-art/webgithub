const Doanhmuc = require("../../models/doanhmuc.model");
const systemConfig = require("../../config/system");
const Account = require("../../models/taikhoan.models"); 

// [GET] /admin/doanhmuc
module.exports.doanhmuc = async (req, res) => {
    try {
        let find = { deleted: false };
        
        if (req.query.status) find.status = req.query.status;
        if (req.query.keyword) {
            find.title = new RegExp(req.query.keyword, "i");
        }

        // Lấy danh sách phẳng, không phân cấp
        const records = await Doanhmuc.find(find).sort({ position: "asc" });

        // Lấy thông tin người tạo
        for (const item of records) {
            if (item.createdBy && item.createdBy.accountID) {
                const user = await Account.findOne({ _id: item.createdBy.accountID });
                if (user) item.accountFullname = user.fullName;
            }
        }

        res.render("admin/pages/doanhmuc/index.pug", {
            pageTitle: "Quản Lý Danh Mục",
            records: records, // Truyền trực tiếp records phẳng
            keyword: req.query.keyword || "",
            status: req.query.status || ""
        });
    } catch (error) {
        console.error("LỖI TẠI TRANG INDEX DANH MỤC:", error);
        res.send("Đang bị lỗi code: " + error.message);
    }
};

// [PATCH] /admin/doanhmuc/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const redirectPath = `/${systemConfig.prefixAdmin}/doanhmuc`;
    try {
        const { status, id } = req.params;
        await Doanhmuc.updateOne({ _id: id }, { status: status });
        req.flash("success", "Cập nhật trạng thái thành công!");
        res.redirect(redirectPath);
    } catch (error) {
        req.flash("error", "Thay đổi trạng thái thất bại!");
        res.redirect(redirectPath);
    }
};

// [GET] /admin/doanhmuc/create
module.exports.create = async (req, res) => {
    // Không cần lấy records để làm cây danh mục cha nữa
    res.render("admin/pages/doanhmuc/create.pug", {
        pageTitle: "Thêm mới Danh mục"
    });
};

// [POST] /admin/doanhmuc/create
module.exports.createPost = async (req, res) => {
    const redirectPath = `/${systemConfig.prefixAdmin}/doanhmuc`;
    try {
        if (!req.body.position || req.body.position === "") {
            const count = await Doanhmuc.countDocuments({ deleted: false });
            req.body.position = count + 1;
        } else {
            req.body.position = parseInt(req.body.position);
        }

        // Xóa parent_id nếu người dùng có gửi lên dữ liệu rác
        delete req.body.parent_id;

        req.body.createdBy = { accountID: res.locals.user.id };

        const record = new Doanhmuc(req.body);
        await record.save();
        
        req.flash("success", "Tạo danh mục thành công!");
        res.redirect(redirectPath);
    } catch (error) {
        req.flash("error", "Tạo danh mục thất bại!");
        res.redirect(redirectPath);
    }
};

// [GET] /admin/doanhmuc/edit/:id
module.exports.edit = async (req, res) => {
    const redirectPath = `/${systemConfig.prefixAdmin}/doanhmuc`;
    try {
        const record = await Doanhmuc.findOne({
            _id: req.params.id,
            deleted: false
        });

        if (!record) {
            req.flash("error", "Không tìm thấy danh mục!");
            return res.redirect(redirectPath);
        }

        res.render("admin/pages/doanhmuc/edit.pug", {
            pageTitle: "Chỉnh sửa Danh mục",
            data: record
        });
    } catch (error) {
        req.flash("error", "ID không hợp lệ!");
        res.redirect(redirectPath);
    }
};

// [PATCH] /admin/doanhmuc/edit/:id
module.exports.editPatch = async (req, res) => {
    const redirectPath = `/${systemConfig.prefixAdmin}/doanhmuc`;
    try {
        if (req.body.position) req.body.position = parseInt(req.body.position);
        
        // Không cho phép sửa parent_id
        delete req.body.parent_id;

        await Doanhmuc.updateOne({
            _id: req.params.id,
            deleted: false
        }, req.body);

        req.flash("success", "Cập nhật danh mục thành công!");
        res.redirect(redirectPath);
    } catch (error) {
        req.flash("error", "Cập nhật thất bại!");
        res.redirect(redirectPath);
    }
};

// [DELETE] /admin/doanhmuc/delete/:id
module.exports.deleteItem = async (req, res) => {
    const redirectPath = `/${systemConfig.prefixAdmin}/doanhmuc`;
    try {
        await Doanhmuc.updateOne({
            _id: req.params.id
        }, {
            deleted: true,
            deletedBy: {
                accountID: res.locals.user.id,
                deletedAt: new Date() 
            }
        });
        req.flash("success", "Xóa thành công!");
        res.redirect(redirectPath);
    } catch (error) {
        req.flash("error", "Xóa thất bại!");
        res.redirect(redirectPath);
    }
};
