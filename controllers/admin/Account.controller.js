const taikhoan = require("../../models/taikhoan.models");
const searchHelper = require("../../helpers/search.js");
const generateHelper = require("../../helpers/generate.js");
const paginationaccountHelper = require("../../helpers/pagination.js");
const systemConfig = require("../../config/system.js"); // Sửa chính tả sytemcofig
const md5 = require("md5");
const Roles = require("../../models/roles.model");
const uploadToCloudinary = require("../../helpers/uploadToCloudinary");
const account = require("../../models/taikhoan.models");
// [GET] /admin/Account
module.exports.Account = async (req, res) => {
  console.log("Dữ liệu Role tại Account Controller:", res.locals.role);
  try {
    let find = {};

    const vaitro = req.query.role;
    const trangthai = req.query.status;

    if (vaitro) find.role = vaitro;
    if (trangthai) find.status = trangthai;

    const objectSearch = searchHelper(req.query);
    if (objectSearch.regex) {
      find.$or = [{
          fullName: objectSearch.regex
        },
        {
          email: objectSearch.regex
        },
        {
          username: objectSearch.regex
        } // Thêm tìm kiếm theo username
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
      .sort({
        createdAt: "desc"
      })
      .limit(ojectPagination.limitItem)
      .skip(ojectPagination.skip);
    for (const duan of listTaikhoan) {
      // Kiểm tra xem duan.createdBy và accountID có tồn tại không để tránh lỗi crash
      if (duan.createdBy && duan.createdBy.accountID) {
        const user = await account.findOne({
          _id: duan.createdBy.accountID
        });

        if (user) {
          // Sửa 'product' thành 'duan'
          duan.accountFullname = user.fullName;
        }
      }
    }
    for (const duan of listTaikhoan) {
      // Kiểm tra xem duan.createdBy và accountID có tồn tại không để tránh lỗi crash
      if (duan.createdBy && duan.createdBy.accountID) {
        const user = await account.findOne({
          _id: duan.createdBy.accountID
        });

        if (user) {
          // Sửa 'product' thành 'duan'
          duan.accountFullname = user.fullName;
        }
      }
    }
    res.render("admin/pages/account/index.pug", {
      pageTitle: "Quản lý tài khoản",
      PrefixAdmin: systemConfig.prefixAdmin,
      taikhoan: listTaikhoan,
      roleFilter: vaitro,
      status: trangthai,
      keyword: objectSearch.keyword,
      pagination: ojectPagination
    });
  } catch (error) {
    console.log("Lỗi:", error);
    res.redirect(`/${systemConfig.prefixAdmin}/account`);
  }
}

// [GET] /admin/Account/create
module.exports.createAccount = async (req, res) => {
  const roles = await Roles.find({
    deleted: false
  });
  res.render("admin/pages/account/create", {
    pageTitle: "Tạo tài khoản admin",
    roles: roles,
  });
}

// [POST] /admin/account/create
module.exports.createAccountPost = async (req, res) => {
  try {
    // 1. Kiểm tra email đã tồn tại chưa
    const emailExists = await taikhoan.findOne({
      email: req.body.email,
      deleted: false
    });

    if (emailExists) {
      console.log("Email đã tồn tại!");
      // Bạn nên dùng req.flash('error', 'Email đã tồn tại') ở đây
      return res.redirect("back");
    }

    // 2. Xử lý Upload ảnh (Cần thiết để lưu trường avatar)
    if (req.file) {
      // Vì bạn dùng multer() không có storage ở Route, nên file sẽ có .buffer
      const result = await uploadToCloudinary(req.file.buffer);
      req.body.avatar = result.secure_url;
    }

    // 3. Mã hóa mật khẩu
    if (req.body.password) {
      req.body.password = md5(req.body.password);
    }

    // 4. Lưu vào database
    const record = new taikhoan(req.body);
    await record.save();
    console.log(req.body);
    console.log("Tạo tài khoản thành công");
    res.redirect(`/${systemConfig.prefixAdmin}/account`);

  } catch (error) {
    console.error("Lỗi khi tạo tài khoản:", error);
    res.redirect("back");
  }
};
// [GET] /admin/account/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await taikhoan.findOne({
      _id: id,
      deleted: false
    });

    const roles = await Roles.find({
      deleted: false
    });

    res.render("admin/pages/account/edit", {
      pageTitle: "Chỉnh sửa tài khoản",
      data: data, // Gửi dữ liệu tài khoản cũ sang file Pug
      roles: roles,
    });
  } catch (error) {
    res.redirect(`/${systemConfig.prefixAdmin}/account`);
  }
};

// [POST] /admin/account/create
// [PATCH] /admin/account/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    // 1. Kiểm tra email tồn tại (nhưng bỏ qua email của bản ghi đang sửa)
    const emailExists = await taikhoan.findOne({
      _id: {
        $ne: id
      }, // $ne = "not equal" (không bằng ID hiện tại)
      email: req.body.email,
      deleted: false
    });

    if (emailExists) {
      console.log("Email này đã được người khác sử dụng!");
      return res.redirect("back");
    }

    // 2. Xử lý ảnh (Chỉ upload nếu người dùng chọn ảnh mới)
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      req.body.avatar = result.secure_url;
    }
    if (req.body.password) {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }

    // 4. Cập nhật vào database
    await taikhoan.updateOne({
      _id: id
    }, req.body);

    console.log("Cập nhật tài khoản thành công");
    res.redirect(`/${systemConfig.prefixAdmin}/account`);

  } catch (error) {
    console.error("Lỗi khi chỉnh sửa tài khoản:", error);
    res.redirect("back");
  }
};
