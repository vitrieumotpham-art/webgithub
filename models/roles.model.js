const mongoose = require("mongoose");

const rolesSchema = new mongoose.Schema({
    title: String, // Tên quyền/vai trò
    mo_ta: String,     // Mô tả
    
    // Sửa lại: permissions nên là mảng String để chứa danh sách các quyền
    permissions: {
        type: [String], 
        default: []
    },

    // Sửa lại: Boolean sẽ tốt hơn cho việc lọc dữ liệu
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
    timestamps: true 
});

// Sửa lại: Tên biến Schema phải khớp với bên trên (rolesSchema)
const Role = mongoose.model('Role', rolesSchema, "roles");

module.exports = Role;