const mongoose = require("mongoose");

const lienheSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    message: { 
      type: String,
      default: ""
    },
    // Ghi chú mới nhất (Hiển thị nhanh trên Card Kanban)
    note: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["Chờ xử lý", "Đã liên hệ", "Đang tư vấn", "Hoàn thành"],
      default: "Chờ xử lý"
    },
    /**
     * THÀNH PHẦN MỚI: Mảng history lưu lại toàn bộ quá trình tư vấn
     * Mỗi lần nhân viên bấm "Cập nhật", một Object mới sẽ được đẩy (push) vào mảng này.
     */
    history: [
      {
        status: String,    // Trạng thái tại thời điểm cập nhật
        note: String,      // Nội dung ghi chú tại thời điểm đó
        updatedBy: {
          account_id: String,
          fullName: String // Lưu tên trực tiếp để hiển thị timeline nhanh hơn
        },
        updatedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    /**
     * Giữ lại createdBy cũ (nếu cần) để lưu vết người đầu tiên tiếp nhận
     */
    createdBy: {
      account_id: String,
      updatedAt: {
        type: Date,
        default: Date.now
      }
    },
    deleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date
  },
  {
    timestamps: true // Tự động tạo createdAt và updatedAt
  }
);

/**
 * Middleware (Pre-save): 
 * Tự động tạo bản ghi lịch sử đầu tiên khi có khách hàng mới gửi yêu cầu
 */
lienheSchema.pre('save', function(next) {
  if (this.isNew) {
    this.history.push({
      status: "Chờ xử lý",
      note: "Khách hàng gửi yêu cầu từ Website",
      updatedAt: new Date()
    });
  }
  next();
});

const Lienhe = mongoose.model("Lienhe", lienheSchema, "contacts");

module.exports = Lienhe;