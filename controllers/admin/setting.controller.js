const SettingGeneral = require("../../models/settings-genneral.model.js");

// [GET] /admin/settings/general
module.exports.index = async (req, res) => {
  // Lấy bản ghi đầu tiên trong bảng settings
  const settingGeneral = await SettingGeneral.findOne({});

  res.render("admin/pages/settings/general.pug", {
    pageTitle: "Cài đặt chung",
    settingGeneral: settingGeneral // Truyền dữ liệu sang file Pug
  });
};

// [PATCH] /admin/settings/general
module.exports.generalPatch = async (req, res) => {
  try {
    const settingGeneral = await SettingGeneral.findOne({});

    if (settingGeneral) {
      // Cập nhật bản ghi hiện tại với dữ liệu mới (bao gồm cả logo từ Cloudinary trong req.body)
      await SettingGeneral.updateOne({ _id: settingGeneral.id }, req.body);
    } else {
      // Tạo mới nếu DB trống hoàn toàn
      const record = new SettingGeneral(req.body);
      await record.save();
    }

    res.redirect("back");
  } catch (error) {
    res.redirect("back");
  }
};