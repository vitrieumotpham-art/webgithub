const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');

// Kích hoạt plugin tạo slug
mongoose.plugin(slug);

const doinguSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true // Bắt buộc phải có tên
    },
    position: String,
    // Tự động tạo slug từ fullname, unique để không trùng URL
    slug: { 
        type: String, 
        slug: "fullname", 
        unique: true 
    },
    description: String,
    avatar: String,
    socials: {
        facebook: { type: String, default: "" },
        twitter: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        instagram: { type: String, default: "" },
        zalo: { type: String, default: "" }
    },
    status: {
        type: String,
        default: "active" // Mặc định là đang hoạt động
    },
    order: {
        type: Number,
        default: 0 // Mặc định vị trí đầu tiên hoặc cuối cùng
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date // Thêm trường này để lưu vết thời gian khi xóa (Soft delete)
}, {
    timestamps: true
});

const Doingu = mongoose.model('doingu', doinguSchema, "doingu");
module.exports = Doingu;