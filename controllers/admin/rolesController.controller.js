const Roles=require("../../models/roles.model");
const searchHelper=require ("../../helpers/search.js");
module.exports.rolesindex= async (rep,res)=>{
    try {
     let find={

      }
    //   const objectSearch=searchHelper(rep.query);
    // if (objectSearch.regex) {
    //         find.$or = [
    //             { 
    //               fullName: objectSearch.regex },
    //               { 
    //               email: objectSearch.regex },
    //             { phone: objectSearch.regex }
    //         ];
    //     }
    const listroles= await Roles.find(find);
    res.render("admin/pages/roles/index.pug",{
    roles:listroles,
    pageTitle:"Tran phân quyền ",
    PrefixAdmin: "/admin",
    // keyword:objectSearch.keyword,
});
    } catch (error) {
    console.log("Lỗi lấy danh sách dự án:", error);
    res.redirect("back"); 
    }

}
module.exports.create= async (rep,res)=>{
res.render("admin/pages/roles/create.pug",{
    pageTitle:"Trang tạo phân quyền ",
});
    
}
module.exports.postcreate = async (req, res) => {
    try {
        // 1. Kiểm tra nếu tên nhóm quyền trống (bảo vệ phía Server)
        // if (!req.body.ten_du_an) {
        //     // Bạn có thể dùng req.flash để báo lỗi nếu có thư viện express-flash
        //     res.redirect("back");
        //     return;
        // }

        // 2. Tạo đối tượng mới dựa trên dữ liệu từ Form (Tiêu đề & Mô tả)
        // Lưu ý: permissions mặc định sẽ là [] theo Schema đã định nghĩa
        const record = new Roles(req.body);

        // 3. Lưu vào Database
        await record.save();

        // 4. Thông báo thành công và chuyển hướng về trang danh sách
        console.log("Tạo mới nhóm quyền thành công!");
        res.redirect(`/admin/roles`); 

    } catch (error) {
        // Xử lý lỗi (ví dụ: trùng tên nếu bạn đặt unique: true)
        console.log("Lỗi tạo nhóm quyền:", error);
        res.redirect("back");
    }
};
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id; 
        
        // 1. Sửa Role thành Roles (cho khớp với tên bạn require ở đầu file)
        const data = await Roles.findOne({
            _id: id,
            deleted: false
        });

        if (data) {
            // 2. Render ra file pug chỉnh sửa
            res.render("admin/pages/roles/edit", {
                pageTitle: "Chỉnh sửa nhóm quyền",
                data: data 
            });
        } else {
            // 3. Nếu không tìm thấy, quay về danh sách
            res.redirect("/admin/roles");
        }
    } catch (error) {
        console.log("Lỗi trang Edit:", error);
        res.redirect("/admin/roles");
    }
};
// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;
        // Cập nhật record với dữ liệu mới từ req.body (title, mo_ta)
        await Roles.updateOne({ _id: id }, req.body);
        
        console.log("Cập nhật thành công!");
        res.redirect("/admin/roles");
    } catch (error) {
        console.log("Lỗi cập nhật:", error);
        res.redirect("/admin/roles");
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

        res.render("admin/pages/roles/detail", {
            pageTitle: "Chi tiết nhóm quyền",
            role: role
        });
    } catch (error) {
        res.redirect("/admin/roles");
    }
};
module.exports.permissions = async (req, res) => {
    try {
        let find = { deleted: false };
        const record = await Roles.find(find); // Đừng quên await

        // "admin/pages/roles/permissions" là đường dẫn file .pug của bạn
        res.render("admin/pages/roles/permissions", {
            pageTitle: "Phân Quyền Hệ Thống",
            records: record
        });
    } catch (error) {
        res.redirect("/admin/roles");
    }
};

module.exports.permissionsPatch = async (req, res) => {
 const permissionsPatch= JSON.parse(req.body.permissions);
 for (const element of permissionsPatch) {
    await Roles.updateOne({_id:element.id},{permissions:element.per})
 }
 res.redirect("back");
};