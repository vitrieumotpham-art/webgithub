const dichvu = require("../../models/dichvu.model");
const searchHelper = require("../../helpers/search.js");
const paginationdichvuHelper = require("../../helpers/pagination.js");
const sytemcofig=require("../../config/system.js");
const mongoose = require("mongoose"); // PHẢI CÓ DÒNG NÀY
// --- 1. Hàm Xử lý Danh sách Dịch vụ (Dichvu) ---
module.exports.Dichvu = async (req, res) => { // Đổi 'rep' thành 'req'
    try {
        const trangthai = req.query.status;
        let find = {
            deleted: false
        };

        if (trangthai) {
            find.status = trangthai;
        }

        const objectSearch = searchHelper(req.query);
        if (objectSearch.regex) {
            find.title = objectSearch.regex;
        }

        const countdichvu = await dichvu.countDocuments(find);

        let objectPagination = paginationdichvuHelper({
                currentPage: 1,
                limitItem: 6
            },
            req.query,
            countdichvu
        );

        const listDichvu = await dichvu.find(find)
            .sort({
                position: "desc"
            })
            .limit(objectPagination.limitItem)
            .skip(objectPagination.skip);

        res.render("admin/pages/dichvu/index.pug", {
            pageTitle: "Tran quản dịch vụ ",
            PrefixAdmin: "/admin",
            status: trangthai,
            keyword: objectSearch.keyword,
            dichvu: listDichvu,
            pagination: objectPagination,
            url: req.originalUrl // Đã đổi từ rep.originalUrl
        });
        // console.log(find);
    } catch (error) {
        console.log("Lỗi lấy danh sách dự án:", error);
        res.redirect("back");
    }
}

// --- 2. Hàm Thay đổi Trạng thái Đơn lẻ (changeHoatdong) ---
module.exports.changeHoatdong = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    const returnUrl = req.body.returnUrl;

    try {
        await dichvu.updateOne({
            _id: id
        }, {
            status: status
        });
        req.flash("success", "Cập nhật trạng thái dịch vụ thành công!");
    } catch (error) {
        console.error("Lỗi cập nhật trạng thái đơn lẻ:", error);
        req.flash("error", "Cập nhật thất bại. Vui lòng thử lại.");
    }

    // Logic chuyển hướng về trang cũ đã chính xác
    if (returnUrl) {
        res.redirect(returnUrl);
    } else {
        res.redirect("/admin/dichvu");
    }
}

module.exports.changeMulti = async (req, res) => {
    try {
        const type = req.body.type;
        const returnUrl = req.body.returnUrl;
        let ids = req.body.ids.split(",").filter(id => id.trim() !== "");
        if (ids.length === 0) {
            console.warn("Không có ID nào được chọn để thực hiện thao tác hàng loạt.");
            return res.redirect(returnUrl || "/admin/dichvu");
        }

        let message = "";

        switch (type) {
            case "active":
                await dichvu.updateMany({
                    _id: {
                        $in: ids
                    }
                }, {
                    status: "active"
                });
                req.flash("success", `cập nhật trạng thái thành công của ${ids.length} sản phẩm`);
                message = `Đã kích hoạt ${ids.length} dịch vụ!`;
                break;
            case "inactive":
                await dichvu.updateMany({
                    _id: {
                        $in: ids
                    }
                }, {
                    
                    status: "inactive"
                });
                req.flash("success", `cập nhật trạng thái thành công của ${ids.length} sản phẩm `);
                message = `Đã dừng ${ids.length} dịch vụ!`;
                break;
            case "delete-all":
                await dichvu.updateMany({
                    _id: {
                        $in: ids
                    }
                }, {
                    deleted: true
                });
                req.flash("success", `xóa thành công ${ids.length} sản phẩm`);
                message = `Đã xóa ${ids.length} dịch vụ!`;
                break;
            case "position-all":
                for( const item of ids){
                    let [id, position]=item.split("-");
                    position=parseInt(position);
                    await dichvu.updateOne({_id:id},{
                        position:position
                    });req.flash("success", `thay đổi vị thành công ${ids.length} sản phẩm`);

                }

                break;
            default:
                break;
        }

        if (returnUrl) {
            res.redirect(returnUrl);
        } else {
            res.redirect("/admin/dichvu");
        }
    } catch (error) {
        console.error("Lỗi cập nhật hàng loạt:", error);
        req.flash("error", `cập nhật ${ids.length} sản phẩm thất bại`);
        res.redirect("back");
    }
}
module.exports.createDichvu = async (req, res) => {
 res.render("admin/pages/dichvu/create.pug",{
    pageTitle:"thêm mới sản phẩm"
});

 }
module.exports.createDichvuPost = async (req, res) => {

    console.log(req.file);
    if (req.body.position === "") { 
        try {
            const countDichvu = await dichvu.countDocuments({ deleted: false }); 
            console.log(countDichvu); 
            req.body.position = countDichvu + 1;
        } catch (error) {
            console.error("Lỗi đếm tài liệu:", error);
        }
    }else{
        req.body.position=parseInt(req.body.position);
    }
    if(req.file){
    req.body.thumbnail=`/uploads/${req.file.filename }`
    }

    const newDichvu=new dichvu(req.body);
    await newDichvu.save(); 
    console.log(req.body); 
    res.redirect(`/${sytemcofig.prefixAdmin}/dichvu`);
};
// controllers/admin/Dichvu.controller.js

module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id; // Lấy ID từ URL
        
        // 🚨 PHẢI SỬ DỤNG findById HOẶC findOne
        const record = await dichvu.findById(id); 

        if (!record) {
             // Xử lý nếu không tìm thấy ID (tùy chọn)
             req.flash("error", "Không tìm thấy dịch vụ này!");
             return res.redirect("/admin/dichvu");
        }

        // 2. Đảm bảo truyền đối tượng vào res.render()
        res.render("admin/pages/dichvu/edit.pug", {
            pageTitle: "Chỉnh sửa dịch vụ",
            dichvu: record, // 🚨 ĐỐI TƯỢNG PHẢI ĐƯỢC TRUYỀN VỚI KEY LÀ 'dichvu'
            // ... (các biến khác)
        });

    } catch (error) {
        console.error("Lỗi khi vào trang chỉnh sửa:", error);
        req.flash("error", "Lỗi ID không hợp lệ!");
        res.redirect("/admin/dichvu");
    }
}
// controllers/admin/Dichvu.controller.js

module.exports.editpatch = async (req, res) => {
    const id = req.params.id;
    if (req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`; 
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
    res.redirect(`/${sytemcofig.prefixAdmin}/dichvu/edit/${id}`)

};
module.exports.detail = async (req, res) => {
try {
        const id = req.params.id; // Lấy ID từ URL
        
        // 🚨 PHẢI SỬ DỤNG findById HOẶC findOne
        const record = await dichvu.findById(id); 
        res.render("admin/pages/dichvu/detail.pug", {
            pageTitle: record.dichvu,
            dichvu: record, 
        });

    } catch (error) {
        console.error("Lỗi khi vào trang chỉnh sửa:", error);
        req.flash("error", "Lỗi ID không hợp lệ!");
        res.redirect("/admin/dichvu");
    }

};
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    // Chuẩn hóa đường dẫn quay về
    const prefix = sytemcofig.prefixAdmin;
    const returnUrl = decodeURIComponent(req.query.returnUrl || `/${prefix}/dichvu`);
    
    try {
        // 1. Kiểm tra ID có đúng định dạng MongoDB không
        if (!mongoose.Types.ObjectId.isValid(id)) {
            req.flash("error", "ID không hợp lệ.");
            return res.redirect(returnUrl);
        }
        
        // 2. Thực hiện xóa mềm (soft delete)
        const result = await dichvu.updateOne({ _id: id }, { 
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
        res.redirect(`/${prefix}/dichvu`);
    }
};