const taikhoan = require("../../models/taikhoan.models");
const searchHelper = require("../../helpers/search.js");
const generateHelper = require("../../helpers/generate.js");
const paginationaccountHelper = require("../../helpers/pagination.js");
const systemConfig = require("../../config/system.js"); // Sửa chính tả sytemcofig
const md5 = require("md5");
const Roles = require("../../models/roles.model");
const uploadToCloudinary = require("../../helpers/uploadToCloudinary");
const account = require("../../models/taikhoan.models");
module.exports.Account = async (req, res) => {
    try {
        let find = {
            deleted: false
        };

        // Lọc theo trạng thái và vai trò (role ID)
        const roleFilterID = req.query.role;
        const trangthai = req.query.status;

        if (roleFilterID) find.role = roleFilterID; 
        if (trangthai) find.status = trangthai;

        // Xử lý tìm kiếm
        const objectSearch = searchHelper(req.query);
        if (objectSearch.regex) {
            find.$or = [
                { fullName: objectSearch.regex },
                { email: objectSearch.regex },
                { username: objectSearch.regex }
            ];
        }

        // Phân trang
        const countaccount = await taikhoan.countDocuments(find);
        let ojectPagination = paginationaccountHelper(
            { currentPage: 1, limitItem: 8 },
            req.query,
            countaccount
        );

        // Lấy danh sách tài khoản
        const listTaikhoan = await taikhoan.find(find)
            .select("-password")
            .sort({ createdAt: "desc" })
            .limit(ojectPagination.limitItem)
            .skip(ojectPagination.skip)
            .lean(); // Quan trọng: dùng .lean() để có thể thêm thuộc tính mới vào object

        // LẤY TÊN QUYỀN VÀ THÔNG TIN PHỤ TRỢ
        await Promise.all(listTaikhoan.map(async (user) => {
            // 1. Lấy tên quyền từ bảng Roles dựa trên ID lưu ở trường 'role'
            if (user.role) {
                const roleData = await Roles.findOne({
                    _id: user.role,
                    deleted: false
                });
                if (roleData) {
                    user.roleTitle = roleData.title; // Gán tên quyền vào thuộc tính roleTitle
                } else {
                    user.roleTitle = "Không xác định";
                }
            }

            // 2. Lấy tên người tạo (nếu cần hiển thị)
            if (user.createdBy && user.createdBy.accountID) {
                const creator = await taikhoan.findOne({ _id: user.createdBy.accountID }).select("fullName");
                if (creator) {
                    user.accountFullname = creator.fullName;
                }
            }
        }));

        // Lấy toàn bộ danh sách Roles để hiển thị trong Select Filter
        const allRoles = await Roles.find({ deleted: false });

        res.render("admin/pages/account/index.pug", {
            pageTitle: "Quản lý tài khoản",
            PrefixAdmin: systemConfig.prefixAdmin,
            taikhoan: listTaikhoan,
            roles: allRoles, // Danh sách quyền cho bộ lọc
            roleFilter: roleFilterID,
            status: trangthai,
            keyword: objectSearch.keyword,
            pagination: ojectPagination
        });
    } catch (error) {
        console.error("Lỗi Controller Account:", error);
        res.redirect(`/${systemConfig.prefixAdmin}/account`);
    }
};
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
    const emailExists = await taikhoan.findOne({
      email: req.body.email,
      deleted: false
    });

    if (emailExists) {
      console.log("Email đã tồn tại!");
      return res.redirect("back");
    }

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      req.body.avatar = result.secure_url;
    }

    if (req.body.password) {
      req.body.password = md5(req.body.password);
    }

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
      data: data, 
      roles: roles,
    });
  } catch (error) {
    res.redirect(`/${systemConfig.prefixAdmin}/account`);
  }
};

// [PATCH] /admin/account/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    const emailExists = await taikhoan.findOne({
      _id: {
        $ne: id
      },
      email: req.body.email,
      deleted: false
    });

    if (emailExists) {
      console.log("Email này đã được người khác sử dụng!");
      return res.redirect("back");
    }

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      req.body.avatar = result.secure_url;
    }
    if (req.body.password) {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }

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
