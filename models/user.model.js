const mongoose = require("mongoose");
const generate = require("../helpers/generate"); // Helper để tạo token ngẫu nhiên

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true, // Không cho phép trùng email
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      trim: true
    },
    avatar: {
      type: String,
      default: "" // Lưu đường dẫn ảnh nếu khách cập nhật profile
    },
    tokenUser: {
      type: String,
      unique: true
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    },
    deleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date
  },
  {
    timestamps: true, // Tự động tạo createdAt và updatedAt
  }
);

const User = mongoose.model("User", userSchema, "users");

module.exports = User;