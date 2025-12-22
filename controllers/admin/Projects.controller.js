const Duan = require("../../models/duan.model");
const searchHelper = require("../../helpers/search.js");
const paginationHelper = require("../../helpers/pagination.js");
const mongoose = require('mongoose');
const systemConfig = require("../../config/system.js");

// [GET] /admin/project
module.exports.duan = async (req, res) => {
    try {
        let find = {
            deleted: false
        };

        // Lọc theo các tiêu chí từ query
        if (req.query.trang_thai) find.trang_thai = req.query.trang_thai;
        if (req.query.is_noibat) find.is_noibat = (req.query.is_noibat === "true");
        if (req.query.loai_hinh) find.loai_hinh = req.query.loai_hinh;
        if (req.query.so_tang) find.so_tang = req.query.so_tang;
        if (req.query.nam_thuc_hien) find.nam_thuc_hien = req.query.nam_thuc_hien;

        // Tìm kiếm
        const objectSearch = searchHelper(req.query);
        if (objectSearch.regex) {
            find.ten_du_an = objectSearch.regex;
        }

        // Phân trang
        const countDuan = await Duan.countDocuments(find);
        let ojectPagination = paginationHelper(
            { currentPage: 1, limitItem: 8 },
            req.query,
            countDuan
        );

        // Lấy dữ liệu
        const listDuAn = await Duan.find(find)
            .sort({ createdAt: "desc" })
            .limit(ojectPagination.limitItem)
            .skip(ojectPagination.skip);

        res.render("admin/pages/project/index.pug", {
            pageTitle: "Quản Lý Dự Án",
            duan: listDuAn,
            trang_thai: req.query.trang_thai,
            is_noibat: req.query.is_noibat,
            loai_hinh: req.query.loai_hinh,
            keyword: objectSearch.keyword,
            pagination: ojectPagination,
            url: req.originalUrl
        });
    } catch (error) {
        console.error("Lỗi danh sách dự án:", error);
        res.redirect("back");
    }
};

// [GET] /admin/project/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            req.flash("error", "ID không hợp lệ!");
            return res.redirect(`/${systemConfig.prefixAdmin}/project`);
        }

        const project = await Duan.findOne({ _id: id, deleted: false });

        if (!project) {
            req.flash("error", "Dự án không tồn tại!");
            return res.redirect(`/${systemConfig.prefixAdmin}/project`);
        }

        res.render("admin/pages/project/detail.pug", {
            pageTitle: project.ten_du_an,
            project: project
        });
    } catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/project`);
    }
};

// [GET] /admin/project/create
module.exports.createduan = async (req, res) => {
    res.render("admin/pages/project/create.pug", {
        pageTitle: "Thêm mới dự án"
    });
};

// [POST] /admin/project/create
module.exports.createduanPost = async (req, res) => {
    try {
        req.body.so_tang = parseInt(req.body.so_tang) || 0;
        req.body.dien_tich = parseInt(req.body.dien_tich) || 0;
        req.body.nam_thuc_hien = parseInt(req.body.nam_thuc_hien) || new Date().getFullYear();
        req.body.is_noibat = (req.body.is_noibat === "true");

        if (req.file) {
            req.body.hinh_anh = `/uploads/${req.file.filename}`;
        }

        const project = new Duan(req.body);
        await project.save();

        req.flash("success", "Tạo dự án mới thành công!");
        res.redirect(`/${systemConfig.prefixAdmin}/project`);
    } catch (error) {
        req.flash("error", "Lỗi khi tạo dự án!");
        res.redirect("back");
    }
};

// [GET] /admin/project/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            req.flash("error", "ID dự án không hợp lệ!");
            return res.redirect(`/${systemConfig.prefixAdmin}/project`);
        }

        const record = await Duan.findOne({ _id: id, deleted: false });

        if (!record) {
            req.flash("error", "Không tìm thấy dự án!");
            return res.redirect(`/${systemConfig.prefixAdmin}/project`);
        }

        res.render("admin/pages/project/edit.pug", {
            pageTitle: "Chỉnh sửa dự án",
            duan: record
        });
    } catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/project`);
    }
};

// [PATCH] /admin/project/edit/:id
module.exports.editpatch = async (req, res) => {
    try {
        const id = req.params.id;
        
        req.body.so_tang = parseInt(req.body.so_tang) || 0;
        req.body.dien_tich = parseInt(req.body.dien_tich) || 0;
        req.body.nam_thuc_hien = parseInt(req.body.nam_thuc_hien) || 0;
        req.body.is_noibat = (req.body.is_noibat === "true");

        if (req.file) {
            req.body.hinh_anh = `/uploads/${req.file.filename}`;
        }

        delete req.body._id;

        await Duan.updateOne({ _id: id }, req.body);
        req.flash("success", "Cập nhật dự án thành công!");
        res.redirect(`/${systemConfig.prefixAdmin}/project`);
    } catch (error) {
        req.flash("error", "Cập nhật thất bại!");
        res.redirect("back");
    }
};

// [DELETE] /admin/project/delete/:id
module.exports.deleteItem = async (req, res) => {
    try {
        const id = req.params.id;
        await Duan.updateOne({ _id: id }, {
            deleted: true,
            deletedAt: new Date()
        });

        req.flash("success", "Đã xóa dự án thành công!");

        // Lấy URL trang trước đó từ Header
        const backURL = req.header('Referer') || `/${systemConfig.prefixAdmin}/project`;
        res.redirect(backURL);
    } catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/project`);
    }
};
// [PATCH] /admin/project/change-hoatdongduan/:is_noibat/:id
module.exports.changeHoatdong = async (req, res) => {
    // ... code xử lý logic update database giữ nguyên ...

    try {
        const id = req.params.id;
        const isNoibat = (req.params.is_noibat === "true");
        await Duan.updateOne({ _id: id }, { is_noibat: isNoibat });
        
        req.flash("success", "Cập nhật trạng thái thành công!");
    } catch (error) {
        req.flash("error", "Cập nhật thất bại!");
    }

    // CÁCH SỬA: Ưu tiên dùng res.redirect("back") chuẩn của Express
    // Nếu có returnUrl từ body thì dùng, không thì quay lại trang trước đó
    if (req.body.returnUrl) {
        res.redirect(req.body.returnUrl);
    } else {
        res.redirect("back"); 
    }
};
// [PATCH] /admin/project/change-multi
module.exports.changeMulti = async (req, res) => {
    try {
        const { type, ids } = req.body;
        const idsArray = ids.split(",");

        switch (type) {
            case "true":
                await Duan.updateMany({ _id: { $in: idsArray } }, { is_noibat: true });
                req.flash("success", "Đã cập nhật trạng thái nổi bật!");
                break;
            case "false":
                await Duan.updateMany({ _id: { $in: idsArray } }, { is_noibat: false });
                req.flash("success", "Đã bỏ trạng thái nổi bật!");
                break;
            case "delete-all":
                await Duan.updateMany({ _id: { $in: idsArray } }, { 
                    deleted: true, 
                    deletedAt: new Date() 
                });
                req.flash("success", "Đã xóa các dự án được chọn!");
                break;
            default:
                break;
        }
        res.redirect("back");
    } catch (error) {
        res.redirect("back");
    }
};