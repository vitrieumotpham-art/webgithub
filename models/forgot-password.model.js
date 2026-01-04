const mongoose = require("mongoose");

const forgotPasswordSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    // Thời gian mã OTP này tự động biến mất khỏi Database
    expireAt: {
      type: Date,
      default: Date.now,
      expires: 180, // Tự động xóa sau 180 giây (3 phút)
    },
  },
  {
    timestamps: true,
  }
);

const ForgotPassword = mongoose.model("ForgotPassword", forgotPasswordSchema, "forgot-password");

module.exports = ForgotPassword;