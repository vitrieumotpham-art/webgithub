const Roles = require("../../models/roles.model");

// [GET] /admin/roles
module.exports.rolesindex = async (req, res) => {
    try {
        // Chỉ lấy những nhóm quyền chưa bị xóa
        let find = {
            deleted: false
        };

        const listroles = await Roles.find(find);

        res.render("admin/pages/roles/index.pug", {
            pageTitle: "Danh Sách Nhóm Quyền",
            roles: listroles,
            PrefixAdmin: "/admin"
        });
    } catch (error) {
        console.error("Lỗi lấy danh sách nhóm quyền:", error);
        res.redirect("/admin/dashboard");
    }
};

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/roles/create.pug", {
        pageTitle: "Tạo Mới Nhóm Quyền",
    });
};

// [POST] /admin/roles/create
module.exports.postcreate = async (req, res) => {
    try {
        // Gán thông tin người tạo từ res.locals.user (đã xử lý ở middleware auth)
        if (res.locals.user) {
            req.body.createdBy = {
                accountID: res.locals.user.id
            };
        }

        const record = new Roles(req.body);
        await record.save();

        console.log("Tạo mới nhóm quyền thành công!");
        res.redirect(`/admin/roles`);
    } catch (error) {
        console.error("Lỗi tạo nhóm quyền:", error);
        res.redirect("back");
    }
};

// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;

        const data = await Roles.findOne({
            _id: id,
            deleted: false
        });

        if (data) {
            res.render("admin/pages/roles/edit", {
                pageTitle: "Chỉnh Sửa Nhóm Quyền",
                data: data
            });
        } else {
            res.redirect("/admin/roles");
        }
    } catch (error) {
        console.error("Lỗi trang Edit:", error);
        res.redirect("/admin/roles");
    }
};

// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;

        // Cập nhật thông tin và thêm vào lịch sử chỉnh sửa nếu cần
        await Roles.updateOne({ _id: id }, req.body);

        console.log("Cập nhật thành công!");
        res.redirect("/admin/roles");
    } catch (error) {
        console.error("Lỗi cập nhật:", error);
        res.redirect("back");
    }
};

// [GET] /admin/roles/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;
        const role = await Roles.findOne({
            _id: id,
            deleted: false
        });

        if (role) {
            res.render("admin/pages/roles/detail", {
                pageTitle: "Chi Tiết Nhóm Quyền",
                role: role
            });
        } else {
            res.redirect("/admin/roles");
        }
    } catch (error) {
        console.error("Lỗi trang Detail:", error);
        res.redirect("/admin/roles");
    }
};

// [GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
    try {
        let find = { deleted: false };
        const records = await Roles.find(find);

        res.render("admin/pages/roles/permissions", {
            pageTitle: "Phân Quyền Hệ Thống",
            records: records
        });
    } catch (error) {
        console.error("Lỗi trang Permissions:", error);
        res.redirect("/admin/roles");
    }
};

// [PATCH] /admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
    try {
        const permissionsPatch = JSON.parse(req.body.permissions);

        for (const element of permissionsPatch) {
            await Roles.updateOne(
                { _id: element.id },
                { permissions: element.per }
            );
        }

        console.log("Cập nhật phân quyền thành công!");
        res.redirect("back");
    } catch (error) {
        console.error("Lỗi cập nhật phân quyền:", error);
        res.redirect("back");
    }
};

// [DELETE] /admin/roles/delete/:id
module.exports.deleteItem = async (req, res) => {
    try {
        const id = req.params.id;

        // Xóa mềm và lưu thông tin người xóa
        const updateObject = {
            deleted: true,
            deletedBy: {
                deletedAt: new Date()
            }
        };

        // Nếu middleware auth đã nạp thông tin user vào res.locals.user
        if (res.locals.user) {
            updateObject.deletedBy.accountID = res.locals.user.id;
        }

        await Roles.updateOne({ _id: id }, updateObject);

        console.log(`Đã xóa nhóm quyền: ${id}`);
        res.redirect("back");
    } catch (error) {
        console.error("Lỗi khi xóa nhóm quyền:", error);
        res.redirect("/admin/roles");
    }
};