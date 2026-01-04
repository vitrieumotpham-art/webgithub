const mongoose = require("mongoose");
const generate = require("../helpers/generate");
const taikhoanSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true // Không cho phép trùng tên đăng nhập
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
     token: {
        type: String,
    },
    avatar: String, // Thêm trường này để lưu link ảnh như trong ảnh bạn gửi
    role: {
        type: String,
        default: "admin"
    },
    status: {
        type: String,
        default: "active"
    },
    deleted: {
        type: Boolean,
        default: false
    },
    createdBy:{
        accountID:String,
        createAt:{
            type:Date,
            default:Date.now
        }
    },
    deletedBy:{
        accountID:String,
        deletedAt:Date
    },
}, {
    // Tự động quản lý createdAt và updatedAt
    timestamps: true 
});

const Taikhoan = mongoose.model('taikhoan', taikhoanSchema, "taikhoan");
module.exports = Taikhoan;