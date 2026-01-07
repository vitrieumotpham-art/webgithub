const baiviet = require("../../models/baiviet.model");
const account = require("../../models/taikhoan.models");
const searchHelper = require("../../helpers/search.js");
const paginationbaivietHelper = require("../../helpers/pagination.js");
const mongoose = require('mongoose');
const systemConfig = require("../../config/system.js");
const uploadToCloudinary = require("../../helpers/uploadToCloudinary");
module.exports.Baiviet = async (req, res) => {
    try {
        let find = { deleted: false };

        const trangthai = req.query.status;
        if (trangthai) find.status = trangthai;

        const objectSearch = searchHelper(req.query);
        if (objectSearch.regex) find.title = objectSearch.regex;

        const countbaiviet = await baiviet.countDocuments(find);
        let objectPagination = paginationbaivietHelper(
            { currentPage: 1, limitItem: 8 },
            req.query,
            countbaiviet
        );

        const listBaiViet = await baiviet.find(find)
            .sort({ createdAt: "desc" })
            .limit(objectPagination.limitItem)
            .skip(objectPagination.skip)
            .lean();
        for (const item of listBaiViet) {
            if (item.createdBy && item.createdBy.accountID) {
                const user = await account.findOne({
                    _id: item.createdBy.accountID
                }).select("fullName");
                if (user) item.accountFullname = user.fullName;
            }
        }

        res.render("admin/pages/baiviet/index.pug", {
            pageTitle: "Trang quản lý bài viết",
            baiviet: listBaiViet,
            status: trangthai,
            keyword: objectSearch.keyword,
            pagination: objectPagination,
            url: req.originalUrl
        });
    } catch (error) {
        console.error("Lỗi Baiviet:", error);
        res.redirect("back");
    }
};module.exports.Baiviet = async (req, res) => {
    try {
        let find = { deleted: false };

        const trangthai = req.query.status;
        if (trangthai) find.status = trangthai;

        const objectSearch = searchHelper(req.query);
        if (objectSearch.regex) find.title = objectSearch.regex;

        const countbaiviet = await baiviet.countDocuments(find);
        let objectPagination = paginationbaivietHelper(
            { currentPage: 1, limitItem: 8 },
            req.query,
            countbaiviet
        );

        const listBaiViet = await baiviet.find(find)
            .sort({ createdAt: "desc" })
            .limit(objectPagination.limitItem)
            .skip(objectPagination.skip)
            .lean(); 

        for (const item of listBaiViet) {
            if (item.createdBy && item.createdBy.account_id) {
                const user = await account.findOne({
                    _id: item.createdBy.account_id
                }).select("fullName");
                if (user) item.accountFullname = user.fullName;
            }
        }

        res.render("admin/pages/baiviet/index.pug", {
            pageTitle: "Trang quản lý bài viết",
            baiviet: listBaiViet,
            status: trangthai,
            keyword: objectSearch.keyword,
            pagination: objectPagination,
            url: req.originalUrl
        });
    } catch (error) {
        console.error("Lỗi Baiviet:", error);
        res.redirect("back");
    }
};
module.exports.changStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    const returnUrl = req.body.returnUrl;

    try {
        await baiviet.updateOne({
            _id: id
        }, {
            status: status
        });

    } catch (error) {
        console.error("Lỗi cập nhật trạng thái bài viết:", error);
    }

    if (returnUrl) {
        res.redirect(returnUrl);
    } else {
        res.redirect("/admin/baiviet");
    }
}
module.exports.createBaiviet = async (req, res) => {
    res.render("admin/pages/baiviet/create.pug", {
        pageTitle: "thêm mới sản phẩm"
    });
}
module.exports.createBaivietPost = async (req, res) => {
    try {
        req.body.views = req.body.views ? parseInt(req.body.views) : 0;
        
        if (!req.body.position || req.body.position === "") {
            const countBaiviet = await baiviet.countDocuments({ deleted: false });
            req.body.position = countBaiviet + 1;
        } else {
            req.body.position = parseInt(req.body.position);
        }

        if (res.locals.user) {
            req.body.createdBy = {
                account_id: res.locals.user.id,
                createdAt: new Date()
            };
        }

        if (req.file) {
            try {
                const result = await uploadToCloudinary(req.file.buffer);
                req.body.avatar = result.secure_url;
            } catch (err) {
                console.error("Lỗi upload ảnh:", err);
            }
        }

        req.body.featured = (req.body.featured === "true" || req.body.featured === "on");

        const newBaiviet = new baiviet(req.body);
        await newBaiviet.save();

        req.flash("success", "Tạo bài viết mới thành công!");
        res.redirect(`/${systemConfig.prefixAdmin}/baiviet`);
    } catch (error) {
        console.error("Lỗi createBaivietPost:", error);
        req.flash("error", "Tạo bài viết thất bại!");
        res.redirect("back");
    }
};
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    const returnUrl = decodeURIComponent(req.query.returnUrl || "/admin/baiviet");

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            req.flash("error", "ID dự án không hợp lệ.");
            return res.redirect(returnUrl);
        }

        const result = await baiviet.updateOne({
            _id: id
        }, {
            deleted: true,
            deletedAt: {
                account_id: res.locals.user.id,
                deletedAt: new Date()
            }
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

module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;


        if (!mongoose.Types.ObjectId.isValid(id)) {
            req.flash("error", "ID bài viết không hợp lệ.");
            return res.redirect(`/${systemConfig.prefixAdmin}/baiviet`);
        }

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


module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;

        req.body.position = req.body.position ? parseInt(req.body.position) : 1;
        req.body.views = req.body.views ? parseInt(req.body.views) : 0;

        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer);
            req.body.avatar = result.secure_url;
        }

        req.body.featured = (req.body.featured === "true" || req.body.featured === "on");


        if (res.locals.user) {
            const updatedBy = {
                accountID: res.locals.user.id,
                updatedAt: new Date()
            };

            await baiviet.updateOne({ _id: id }, {
                ...req.body,
                $push: { updatedBy: updatedBy } 
            });
        } else {
            await baiviet.updateOne({ _id: id }, req.body);
        }

        req.flash("success", "Cập nhật bài viết thành công!");
        res.redirect(`/${systemConfig.prefixAdmin}/baiviet`);
    } catch (error) {
        console.error("Lỗi editPatch:", error);
        req.flash("error", "Cập nhật thất bại!");
        res.redirect("back");
    }
};

module.exports.trash = async (req, res) => {
    try {
        let find = { deleted: true };


        const objectSearch = searchHelper(req.query);
        if (objectSearch.regex) find.title = objectSearch.regex;


        const countbaiviet = await baiviet.countDocuments(find);
        let objectPagination = paginationbaivietHelper(
            { currentPage: 1, limitItem: 8 },
            req.query,
            countbaiviet
        );

        const listBaiViet = await baiviet.find(find)
            .sort({ "deletedAt.deletedAt": "desc" })
            .limit(objectPagination.limitItem)
            .skip(objectPagination.skip)
            .lean();


        for (const item of listBaiViet) {
            if (item.deletedAt && item.deletedAt.account_id) {
                const user = await account.findOne({
                    _id: item.deletedAt.account_id
                }).select("fullName");
                if (user) item.accountFullname = user.fullName;
            }
        }

        res.render("admin/pages/baiviet/trash.pug", {
            pageTitle: "Thùng rác bài viết",
            baiviet: listBaiViet,
            keyword: objectSearch.keyword,
            pagination: objectPagination,
            PefixAdmin: "admin"
        });
    } catch (error) {
        res.redirect("back");
    }
};


module.exports.restore = async (req, res) => {
    const id = req.params.id;
    await baiviet.updateOne({ _id: id }, { deleted: false });
    req.flash("success", "Khôi phục bài viết thành công!");
    res.redirect("back");
};

module.exports.deletePermanently = async (req, res) => {
    const id = req.params.id;
    await baiviet.deleteOne({ _id: id });
    req.flash("success", "Đã xóa vĩnh viễn bài viết!");
    res.redirect("back");
};