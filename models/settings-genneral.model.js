const mongoose = require("mongoose");

const settingGeneralSchema = new mongoose.Schema(
  {
    websiteName: String, // Ví dụ: PNT DECOR
    logo: String,
    phone: String,
    email: String,
    address: String,
    description: String, // Mô tả ngắn ở Footer
    copyright: String,   // Dòng bản quyền dưới cùng
    facebook: String,
    instagram: String,
    socialOther: String, // Link cho icon social thứ 3 của bạn
  },
  { timestamps: true }
);
const SettingGeneral = mongoose.model("SettingGeneral", settingGeneralSchema, "settings-general");

module.exports = SettingGeneral;