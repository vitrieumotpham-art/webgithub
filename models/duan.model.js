const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const duanSchema = new mongoose.Schema({
    ten_du_an: String,
    slug: {
        type: String,
        slug: "ten_du_an",
        unique: true
    },
    chu_dau_tu: String,
    loai_hinh: String, // Ví dụ: BietThu, NhaPho, NoiThat
    phong_cach: {
        type: String,
        default: ""
    },
    so_tang: Number,
    dien_tich: Number,
    dia_diem: String,
    nam_thuc_hien: Number,
    trang_thai: String, // active, inactive
    
    // Trường này để lọc "DỰ ÁN NỔI BẬT"
    is_noibat: {
        type: Boolean,
        default: false
    },
    
    hinh_anh: [String],
    mo_ta: String,
    chi_phi: {
        type:Number,
        default: 0
    },
    
    createdBy: {
        accountID: String,
        createdAt: { // Lưu ý: timestamps đã có createdAt chung, nhưng nếu bạn muốn lưu riêng người tạo thì giữ lại
            type: Date,
            default: Date.now
        }
    },
    
    // SỬA TẠI ĐÂY: Chuyển từ String sang Boolean
    deleted: {
        type: Boolean,
        default: false
    },
    
    deletedBy: {
        accountID: String,
        deletedAt: Date
    },
    
    updatedBy: [
        {
            accountID: String,
            updatedAt: Date
        }
    ],
    position: Number
}, {
    timestamps: true // Tự động tạo createdAt (dùng để check dự án MỚI) và updatedAt
});

const duan = mongoose.model('duan', duanSchema, "duan");
module.exports = duan;