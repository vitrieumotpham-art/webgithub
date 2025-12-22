const Doingu = require("../../models/doingu.model"); 
const searchHelper = require("../../helpers/search.js");
const systemConfig = require("../../config/system.js"); // Sửa chính tả sytemcofig
const mongoose = require("mongoose"); // PHẢI CÓ DÒNG NÀY
const uploadToCloudinary = require("../../helpers/uploadToCloudinary");
// [GET] /admin/doingu
module.exports.Doingu = async (req, res) => {
    try {
        let find = {
            deleted: false 
        };

        const trangthai = req.query.status;
        if (trangthai) {
            find.status = trangthai;
        }

        const objectSearch = searchHelper(req.query);
        if (objectSearch.regex) {
            find.$or = [
                { fullname: objectSearch.regex },
                { position: objectSearch.regex }
            ];
        }

        const listDoingu = await Doingu.find(find).sort({ order: "asc" });

        res.render("admin/pages/doingu/index.pug", {
            pageTitle: "Trang quản lý đội ngũ",
            PrefixAdmin: `/${systemConfig.prefixAdmin}`, // Thêm / để tránh lỗi nối chuỗi
            doingu: listDoingu,
            status: trangthai,
            keyword: objectSearch.keyword,
        });

    } catch (error) {
        console.log("Lỗi:", error);
        res.redirect(`/${systemConfig.prefixAdmin}/doingu`); // Sửa "back" thành đường dẫn này
    }
}

// [GET] /admin/doingu/create
module.exports.createDoingu = async (req, res) => {
    res.render("admin/pages/doingu/create.pug", {
        pageTitle: "Thêm mới nhân sự",
    });
}

// [POST] /admin/doingu/create
module.exports.createDoinguPost = async (req, res) => {
    try {
        // 1. Xử lý trường 'order'
        if (req.body.order === "" || !req.body.order) {
            const count = await Doingu.countDocuments({ deleted: false });
            req.body.order = count + 1;
        } else {
            req.body.order = parseInt(req.body.order);
        }

        // 2. Xử lý Socials (Đóng gói vào object theo đúng Schema)
        req.body.socials = {
            facebook: req.body.facebook || "",
            twitter: req.body.twitter || "",
            linkedin: req.body.linkedin || "",
            instagram: req.body.instagram || "",
            zalo: req.body.zalo || ""
        };

        // 3. Xử lý Avatar (Khớp với name="avatar" trong Pug)
         if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer);
            req.body.avatar = result.secure_url; 
          }

        req.body.deleted = false;

        const newMember = new Doingu(req.body);
        await newMember.save();

        // CHỖ NÀY: Phải có dấu / ở đầu để không bị lỗi URL
        res.redirect(`/${systemConfig.prefixAdmin}/doingu`);

    } catch (error) {
        console.error("Lỗi khi tạo nhân sự:", error);
        res.redirect(`/${systemConfig.prefixAdmin}/doingu/create`);
    }
};
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    // Chuẩn hóa đường dẫn quay về
    const prefix = systemConfig.prefixAdmin;
    const returnUrl = decodeURIComponent(req.query.returnUrl || `/${prefix}/doingu`);
    
    try {
        // 1. Kiểm tra ID có đúng định dạng MongoDB không
        if (!mongoose.Types.ObjectId.isValid(id)) {
            req.flash("error", "ID không hợp lệ.");
            return res.redirect(returnUrl);
        }
        
        // 2. Thực hiện xóa mềm (soft delete)
        const result = await Doingu.updateOne({ _id: id }, { 
            deleted: true,
            deletedAt: new Date()
        });

        if (result.matchedCount === 0) {
             req.flash("error", "Không tìm thấy bản ghi để xóa.");
             return res.redirect(returnUrl);
        }
        
        req.flash("success", "Xóa thành công!");
        res.redirect(returnUrl);
        
    } catch (error) {
        console.error("Lỗi xóa:", error);
        req.flash("error", "Xóa thất bại. Vui lòng thử lại.");
        // Lỗi thì quay lại trang danh sách dịch vụ, đừng nhảy sang Project
        res.redirect(`/${prefix}/doingu`);
    }
};
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id; // Lấy ID từ URL
        
        // 1. Tìm bản ghi trong database
        const record = await Doingu.findOne({
            _id: id,
            deleted: false
        }); 

        if (!record) {
            req.flash("error", "Không tìm thấy dữ liệu!");
            return res.redirect(`/${systemConfig.prefixAdmin}/doingu`);
        }

        // 2. Render giao diện
        res.render("admin/pages/doingu/edit.pug", {
            pageTitle: "Chỉnh sửa sản phẩm",
            data: record, // 🚨 QUAN TRỌNG: Đổi tên thành 'data' để khớp với file Pug của bạn
            PefixAdmin: systemConfig.prefixAdmin // Truyền prefix để link Hủy bỏ hoạt động
        });

    } catch (error) {
        console.error("Lỗi khi vào trang chỉnh sửa:", error);
        req.flash("error", "ID không hợp lệ!");
        res.redirect(`/${systemConfig.prefixAdmin}/doingu`);
    }
}
// controllers/admin/Dichvu.controller.js

module.exports.editpatch = async (req, res) => {
    const id = req.params.id;
     if (req.file) {
        const result = await uploadToCloudinary(req.file.buffer);
        req.body.avatar = result.secure_url; 
      }

    try {
        delete req.body._id; 
        delete req.body.id; 
        await dichvu.updateOne({
            _id: id, 
        }, req.body);
        req.flash("success", `Cập nhật dịch vụ thành công!`);

    } catch (error) {
        req.flash("error", `Cập nhật dịch vụ thất bại`);
        console.error("Lỗi cập nhật dịch vụ:", error);
    } 
    res.redirect(`/${sytemcofig.prefixAdmin}/doingu/edit/${id}`)

};