const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const doanhmucSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String 
    },
    status: { 
      type: String, 
      default: "active" 
    },
    position: { 
      type: Number 
    },
    slug: { 
      type: String, 
      slug: "title", 
      unique: true,
      sparse: true // THÊM DÒNG NÀY: Để tránh lỗi unique khi xóa mềm
    },
    deleted: { 
      type: Boolean, 
      default: false 
    },
    createdBy: {
        accountID: String,
        createdAt: { // SỬA: createAt -> createdAt (Cho đúng ngữ pháp)
            type: Date,
            default: Date.now
        }
    },
    deletedBy: {
        accountID: String,
        deletedAt: Date
    },
    // Thêm trường cập nhật để quản lý tốt hơn
    updatedBy: [
      {
        accountID: String,
        updatedAt: Date
      }
    ]
  },
  {
    timestamps: true,
  }
);

const Doanhmuc = mongoose.model("Doanhmuc", doanhmucSchema, "doanhmuc");

module.exports = Doanhmuc;