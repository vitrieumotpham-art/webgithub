const lienhe = require("../../models/lienhe.model");
const Account = require("../../models/taikhoan.models.js");
const searchHelper = require("../../helpers/search.js");

// [GET] /admin/lienhe
module.exports.Lienhe = async (req, res) => {
    try {
        let find = { deleted: false };

        const objectSearch = searchHelper(req.query);
        if (objectSearch.regex) {
            find.$or = [
                { fullName: objectSearch.regex },
                { email: objectSearch.regex },
                { phone: objectSearch.regex }
            ];
        }

        // Lấy danh sách liên hệ, sắp xếp mới nhất lên đầu
        const listLienhe = await lienhe.find(find).sort({ createdAt: -1 });

        // Xử lý hiển thị tên nhân viên phụ trách cuối cùng lên giao diện Kanban
        if (Array.isArray(listLienhe)) {
            for (const item of listLienhe) {
                if (item.history && item.history.length > 0) {
                    // Lấy phần tử cuối cùng trong mảng history (lần cập nhật mới nhất)
                    const lastUpdate = item.history[item.history.length - 1];
                    // Gán tên nhân viên vào biến ảo để Pug hiển thị
                    item.accountFullName = lastUpdate.updatedBy ? lastUpdate.updatedBy.fullName : "Hệ thống";
                }
            }
        }

        res.render("admin/pages/lienhekhachhang/index.pug", {
            pageTitle: "Quản lý Tiến độ Tư vấn",
            lienhe: listLienhe,
            keyword: objectSearch.keyword
        });

    } catch (error) {
        console.error("Lỗi lấy danh sách liên hệ:", error);
        res.redirect("/admin/dashboard");
    }
};

// [POST] /admin/lienhe/change-status
module.exports.changeStatus = async (req, res) => {
    try {
        const { id, status, note } = req.body;

        /**
         * SỬ DỤNG $push: Để thêm một bản ghi vào mảng history mà không làm mất lịch sử cũ.
         * SỬ DỤNG $set: Để cập nhật trạng thái và ghi chú hiện tại của khách hàng.
         */
        await lienhe.updateOne(
            { _id: id },
            { 
                $set: { 
                    status: status,
                    note: note 
                },
                $push: {
                    history: {
                        status: status,
                        note: note,
                        updatedBy: {
                            account_id: res.locals.user.id,
                            fullName: res.locals.user.fullName // Tên nhân viên đăng nhập
                        },
                        updatedAt: new Date()
                    }
                }
            }
        );

        req.flash("success", `Đã cập nhật tiến độ tư vấn cho khách hàng!`);
        
        const backUrl = req.get("Referrer") || "/admin/lienhe";
        res.redirect(backUrl);
        
    } catch (error) {
        console.error("Lỗi cập nhật trạng thái:", error);
        req.flash("error", "Cập nhật thất bại!");
        const backUrl = req.get("Referrer") || "/admin/lienhe";
        res.redirect(backUrl);
    }
};

// [POST] /admin/lienhe/delete/:id
module.exports.deleteItem = async (req, res) => {
    try {
        const id = req.params.id;
        await lienhe.updateOne({ _id: id }, { 
            deleted: true,
            deletedAt: new Date()
        });

        req.flash("success", "Đã chuyển liên hệ vào thùng rác!");
        const backUrl = req.get("Referrer") || "/admin/lienhe";
        res.redirect(backUrl);
    } catch (error) {
        const backUrl = req.get("Referrer") || "/admin/lienhe";
        res.redirect(backUrl);
    }
};