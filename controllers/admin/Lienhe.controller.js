const lienhe = require("../../models/lienhe.model");
const Account = require("../../models/taikhoan.models.js");
const searchHelper = require("../../helpers/search.js");

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

        const listLienhe = await lienhe.find(find).sort({ createdAt: -1 });

        if (Array.isArray(listLienhe)) {
            for (const item of listLienhe) {
                if (item.history && item.history.length > 0) {
                    const lastUpdate = item.history[item.history.length - 1];
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
                            fullName: res.locals.user.fullName 
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