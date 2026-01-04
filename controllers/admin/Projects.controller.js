const Duan = require("../../models/duan.model");
const account = require("../../models/taikhoan.models");
const searchHelper = require("../../helpers/search.js");
const paginationHelper = require("../../helpers/pagination.js");
const mongoose = require('mongoose');
const systemConfig = require("../../config/system.js");
const uploadToCloudinary = require("../../helpers/uploadToCloudinary");
const Doanhmuc = require("../../models/doanhmuc.model");
// [GET] /admin/project
module.exports.duan = async (req, res) => {
    try {
        let find = {
            deleted: false,

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
        let ojectPagination = paginationHelper({
                currentPage: parseInt(req.query.page) || 1, // Lấy trang từ URL
                limitItem: 8
            },
            req.query,
            countDuan
        );

        let sort = {};

        if (req.query.sortKey && req.query.sortValue) {
            const key = req.query.sortKey;
            const value = req.query.sortValue;

            // Ép kiểu về số: desc -> -1, asc -> 1. Đảm bảo Mongoose nhận 100%
            sort[key] = (value === "desc" ? -1 : 1);
        } else {
            // Mặc định diện tích giảm dần (Cao -> Thấp)
            sort.dien_tich = -1;
        }

        // Log ra để bạn tự tin nhìn thấy nó chạy trong Terminal
        console.log("--- DEBUG SORT ---");
        console.log("Object gửi vào Mongoose:", sort);

        // Lấy dữ liệu
        const listDuAn = await Duan.find(find)
            .sort(sort)
            .limit(ojectPagination.limitItem)
            .skip(ojectPagination.skip).lean();;

        for (const duan of listDuAn) {
            // 1. Xử lý thông tin người tạo
            if (duan.createdBy && duan.createdBy.accountID) {
                const user = await account.findOne({
                    _id: duan.createdBy.accountID
                }).lean();

                if (user) {
                    duan.accountFullname = user.fullName;
                }
            }

            // 2. Xử lý thông tin người cập nhật cuối cùng
            if (duan.updatedBy && duan.updatedBy.length > 0) {
                // Lấy phần tử cuối cùng trong mảng updatedBy
                const lastUpdate = duan.updatedBy[duan.updatedBy.length - 1];

                if (lastUpdate.accountID) {
                    const userUpdate = await account.findOne({
                        _id: lastUpdate.accountID
                    }).lean();

                    if (userUpdate) {
                        // Gán vào một thuộc tính mới để hiển thị bên Pug
                        duan.accountUpdateFullname = userUpdate.fullName;
                        // Lưu luôn thời gian cập nhật cuối để Pug hiển thị
                        duan.lastUpdatedAt = lastUpdate.updatedAt;
                    }
                }
            }
        }



        res.render("admin/pages/Project/index.pug", {
            pageTitle: "Quản Lý Dự Án",
            duan: listDuAn,
            trang_thai: req.query.trang_thai,
            is_noibat: req.query.is_noibat,
            loai_hinh: req.query.loai_hinh,
            keyword: objectSearch.keyword,
            pagination: ojectPagination,
            url: req.originalUrl,
            sortKey: req.query.sortKey || "dien_tich",
            sortValue: req.query.sortValue || "desc"
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

        const project = await Duan.findOne({
            _id: id,
            deleted: false
        });

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
    let find = {
        deleted: false
    };
    const category = await Doanhmuc.find(find);


    res.render("admin/pages/project/create.pug", {
        catelory: category,
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

        req.body.createdBy = {
            accountID: res.locals.user.id
        };

        const project = new Duan(req.body);
        await project.save();

        req.flash("success", "Tạo dự án mới thành công!");
        res.redirect(`/${systemConfig.prefixAdmin}/project`);
    } catch (error) {
        console.log(error);
        req.flash("error", "Lỗi khi tạo dự án!");
        res.redirect("back");
    }
};
// [GET] /admin/project/edit/:id
// [GET] /admin/project/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const record = await Duan.findOne({
      _id: id,
      deleted: false
    });

    res.render("admin/pages/project/edit.pug", {
      pageTitle: "Chỉnh sửa dự án",
      duan: record // <--- PHẢI ĐẶT TÊN LÀ 'duan' để khớp với file Pug
    });
  } catch (error) {
    res.redirect("back");
  }
};

// [PATCH] /admin/project/edit/:id
// [PATCH] /admin/project/edit/:id
// [PATCH] /admin/project/edit/:id
module.exports.editpatch = async (req, res) => {
    try {
        const id = req.params.id;

        // Xử lý các checkbox và số
        req.body.so_tang = parseInt(req.body.so_tang) || 0;
        req.body.dien_tich = parseInt(req.body.dien_tich) || 0;
        req.body.nam_thuc_hien = parseInt(req.body.nam_thuc_hien) || 0;
        req.body.is_noibat = (req.body.is_noibat === "true" || req.body.is_noibat === "on");

        // QUAN TRỌNG: Bảo vệ ảnh cũ nếu không upload ảnh mới
        if (Array.isArray(req.body.hinh_anh)) {
            req.body.hinh_anh = req.body.hinh_anh[0];
        }
        if (!req.body.hinh_anh || req.body.hinh_anh === "") {
            delete req.body.hinh_anh;
        }

        const updatedBy = {
            accountID: res.locals.user.id,
            updatedAt: new Date()
        };

        await Duan.updateOne({ _id: id }, {
            ...req.body,
            $push: { updatedBy: updatedBy } // Lưu lịch sử chỉnh sửa
        });

        req.flash("success", "Cập nhật dự án thành công!");
        res.redirect(`/${systemConfig.prefixAdmin}/project`);
    } catch (error) {
        req.flash("error", "Lỗi cập nhật!");
        res.redirect("back");
    }
};

// [DELETE] /admin/project/delete/:id
module.exports.deleteItem = async (req, res) => {
    try {
        const id = req.params.id;
        await Duan.updateOne({
            _id: id
        }, {
            deleted: true,
            // deletedAt: new Date()
            deletedBy: {
                accountID: res.locals.user.id,
                deletedAt: new Date()
            }
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

        const updatedBy = {
            accountID: res.locals.user.id,
            updatedAt: new Date()
        }

        await Duan.updateOne({
            _id: id
        }, {
            is_noibat: isNoibat,
            $push: {
                updatedBy: updatedBy
            }
        });

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
        const {
            type,
            ids
        } = req.body;
        const idsArray = ids.split(",");

        switch (type) {
            case "true":
                await Duan.updateMany({
                    _id: {
                        $in: idsArray
                    }
                }, {
                    is_noibat: true
                });
                req.flash("success", "Đã cập nhật trạng thái nổi bật!");
                break;
            case "false":
                await Duan.updateMany({
                    _id: {
                        $in: idsArray
                    }
                }, {
                    is_noibat: false
                });
                req.flash("success", "Đã bỏ trạng thái nổi bật!");
                break;
            case "delete-all":
                await Duan.updateMany({
                    _id: {
                        $in: idsArray
                    }
                }, {
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
// doanh muc
// --- QUẢN LÝ DANH MỤC & CÁC MODULE ADMIN ---

// 1. XỬ LÝ XÓA BẢN GHI (Dùng chung cho cả Dự án, Dịch vụ, Danh mục)
// 2. XỬ LÝ BỘ LỌC TRẠNG THÁI (STATUS)