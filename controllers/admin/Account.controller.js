const taikhoan = require("../../models/taikhoan.models");
const Roles = require("../../models/roles.model");
const searchHelper = require("../../helpers/search.js");
const paginationaccountHelper = require("../../helpers/pagination.js");
const systemConfig = require("../../config/system.js");
const generateHelper = require("../../helpers/generate.js");
const md5 = require("md5");
const uploadToCloudinary = require("../../helpers/uploadToCloudinary");

// [GET] /admin/account
module.exports.Account = async (req, res) => {
    try {
        let find = { deleted: false };

        const roleFilterID = req.query.role;
        const trangthai = req.query.status;
        if (roleFilterID) find.role = roleFilterID;
        if (trangthai) find.status = trangthai;

        const objectSearch = searchHelper(req.query);
        if (objectSearch.regex) {
            find.$or = [
                { fullName: objectSearch.regex },
                { email: objectSearch.regex },
                { username: objectSearch.regex }
            ];
        }

        const countaccount = await taikhoan.countDocuments(find);
        let objectPagination = paginationaccountHelper(
            { currentPage: 1, limitItem: 8 },
            req.query,
            countaccount
        );

        const listTaikhoan = await taikhoan.find(find)
            .select("-password")
            .sort({ createdAt: "desc" })
            .limit(objectPagination.limitItem)
            .skip(objectPagination.skip)
            .lean(); 

        await Promise.all(listTaikhoan.map(async (user) => {
            if (user.role) {
                const roleData = await Roles.findOne({ _id: user.role, deleted: false });
                user.roleTitle = roleData ? roleData.title : "Không xác định";
            }
            if (user.createdBy?.accountID) {
                const creator = await taikhoan.findOne({ _id: user.createdBy.accountID }).select("fullName");
                if (creator) user.accountFullname = creator.fullName;
            }
        }));

        const allRoles = await Roles.find({ deleted: false });

        res.render("admin/pages/account/index.pug", {
            pageTitle: "Quản lý tài khoản",
            taikhoan: listTaikhoan,
            roles: allRoles,
            pagination: objectPagination,
            PrefixAdmin: systemConfig.prefixAdmin
        });
    } catch (error) {
        console.error("Lỗi trang danh sách:", error);
        res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
    }
};

// [GET] /admin/account/create
module.exports.createAccount = async (req, res) => {
    try {
        const roles = await Roles.find({ deleted: false });
        res.render("admin/pages/account/create", {
            pageTitle: "Tạo tài khoản mới",
            roles: roles,
            PrefixAdmin: systemConfig.prefixAdmin
        });
    } catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/account`);
    }
};

// [POST] /admin/account/create
module.exports.createAccountPost = async (req, res) => {
    try {
        const exist = await taikhoan.findOne({
            $or: [{ email: req.body.email }, { username: req.body.username }],
            deleted: false
        });

        if (exist) {
            console.warn("Email hoặc Username đã tồn tại!");
            return res.redirect("back");
        }

        // Mã hóa pass
        if (req.body.password) {
            req.body.password = md5(req.body.password.trim());
        }

        // Tạo token ngẫu nhiên cho user mới
        req.body.token = generateHelper.generateRandomString(30);

        if (res.locals.user) {
            req.body.createdBy = { accountID: res.locals.user.id };
        }

        const record = new taikhoan(req.body);
        await record.save();
        
        res.redirect(`/${systemConfig.prefixAdmin}/account`);
    } catch (error) {
        console.error("Lỗi tạo tài khoản:", error);
        res.redirect("back");
    }
};

// [GET] /admin/account/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const data = await taikhoan.findOne({ _id: req.params.id, deleted: false });
        if(!data) return res.redirect(`/${systemConfig.prefixAdmin}/account`);

        const roles = await Roles.find({ deleted: false });
        
        res.render("admin/pages/account/edit", {
            pageTitle: "Chỉnh sửa tài khoản",
            data: data,
            roles: roles,
            PrefixAdmin: systemConfig.prefixAdmin
        });
    } catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/account`);
    }
};

// [PATCH] /admin/account/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;

        // 1. Kiểm tra trùng
        const exist = await taikhoan.findOne({
            _id: { $ne: id },
            $or: [{ email: req.body.email }, { username: req.body.username }],
            deleted: false
        });

        if (exist) {
            console.warn("Dữ liệu trùng lặp!");
            return res.redirect("back");
        }

        // 2. Xử lý mật khẩu
        if (req.body.password && req.body.password.trim() !== "") {
            req.body.password = md5(req.body.password.trim());
        } else {
            // Quan trọng: Nếu rỗng thì xóa luôn key password để không bị update rỗng vào DB
            delete req.body.password; 
        }

        // 3. Xử lý ảnh
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer);
            req.body.avatar = result.secure_url;
        }

        // 4. BẢO VỆ TOKEN: Tuyệt đối không cho phép update đè Token từ Form
        delete req.body.token;

        await taikhoan.updateOne({ _id: id, deleted: false }, req.body);

        console.log("Cập nhật thành công!");
        res.redirect(`/${systemConfig.prefixAdmin}/account`);
    } catch (error) {
        console.error("Lỗi cập nhật:", error);
        res.redirect("back");
    }
};

// [PATCH] /admin/account/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        await taikhoan.updateOne({ _id: req.params.id, deleted: false }, { 
            status: req.params.status
        });
        res.redirect("back");
    } catch (error) {
        res.redirect("back");
    }
};

// [DELETE] /admin/account/delete/:id
module.exports.deleteItem = async (req, res) => {
    try {
        await taikhoan.updateOne({ _id: req.params.id }, {
            deleted: true,
            deletedAt: new Date()
        });
        res.redirect("back");
    } catch (error) {
        res.redirect("back");
    }
};