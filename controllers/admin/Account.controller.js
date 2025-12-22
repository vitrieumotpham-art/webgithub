const taikhoan = require("../../models/taikhoan.models");
const searchHelper = require("../../helpers/search.js");
const paginationaccountHelper = require("../../helpers/pagination.js");
const systemConfig = require("../../config/system.js"); // Sửa chính tả sytemcofig
const md5 = require("md5");

// [GET] /admin/Account
module.exports.Account = async (req, res) => {
    try {
        let find = {
        };

        const vaitro = req.query.role;
        const trangthai = req.query.status;

        if (vaitro) find.role = vaitro;
        if (trangthai) find.status = trangthai;

        const objectSearch = searchHelper(req.query);
        if (objectSearch.regex) {
            find.$or = [
                { fullName: objectSearch.regex },
                { email: objectSearch.regex },
                { username: objectSearch.regex } // Thêm tìm kiếm theo username
            ];
        }

        const countaccount = await taikhoan.countDocuments(find);
        let ojectPagination = paginationaccountHelper({
                currentPage: 1,
                limitItem: 8
            },
            req.query,
            countaccount
        );

        const listTaikhoan = await taikhoan.find(find)
            .select("-password") // Bảo mật: Không lấy mật khẩu
            .sort({ createdAt: "desc" })
            .limit(ojectPagination.limitItem)
            .skip(ojectPagination.skip);

        res.render("admin/pages/account/index.pug", {
            pageTitle: "Quản lý tài khoản",
            PrefixAdmin: systemConfig.prefixAdmin,
            taikhoan: listTaikhoan,
            role: vaitro,
            status: trangthai,
            keyword: objectSearch.keyword,
            pagination: ojectPagination
        });
    } catch (error) {
        console.log("Lỗi:", error);
        res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
    }
}

// [GET] /admin/Account/create
module.exports.createAccount = async (req, res) => {
    res.render("admin/pages/account/create.pug", {
        pageTitle: "Tạo tài khoản admin",
        PrefixAdmin: systemConfig.prefixAdmin
    });
}

// [POST] /admin/Account/create
module.exports.createAccountPost = async (req, res) => {
    try {
        // 1. Kiểm tra email tồn tại
        const emailExist = await taikhoan.findOne({
            email: req.body.email,
            deleted: false
        });

        if (emailExist) {
            // Bạn nên dùng req.flash để báo lỗi ở đây
            return res.redirect(`/${systemConfig.prefixAdmin}/account/create`)
        }

        // 2. Mã hóa mật khẩu
        if (req.body.password) {
            req.body.password = md5(req.body.password);
        }

        // 3. Xử lý ảnh avatar (Khớp với name="avatar" trong Pug)
        if (req.file) {
            req.body.avatar = `/uploads/${req.file.filename}`;
        }

        // 4. Lưu vào DB
        req.body.deleted = false;
        const newAccount = new taikhoan(req.body);
        await newAccount.save();

        // 5. Chuyển hướng (Thêm dấu / ở đầu để tạo đường dẫn tuyệt đối)
        res.redirect(`/${systemConfig.prefixAdmin}/account`);
        
    } catch (error) {
        console.error("Lỗi tạo tài khoản:", error);
        // Nếu lỗi, quay lại trang tạo mới
        res.redirect(`/${systemConfig.prefixAdmin}/account/create`);
    }
}