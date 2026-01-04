const Duan = require("../../models/duan.model");
const Baiviet = require("../../models/baiviet.model");
const Lienhe = require("../../models/lienhe.model");

// [GET] /admin/thongke
module.exports.index = async (req, res) => {
  try {
    // 1. Thống kê số lượng cơ bản
    const countProject = await Duan.countDocuments({ deleted: false });
    const countLienhe = await Lienhe.countDocuments({ deleted: false });
    const countArticle = await Baiviet.countDocuments({ deleted: false });

    // 2. Tính tổng doanh thu (Tất cả dự án chưa xóa)
    const revenueResult = await Duan.aggregate([
      { $match: { deleted: false } }, 
      { $group: { _id: null, total: { $sum: { $toDouble: "$chi_phi" } } } }
    ]);
    const totalRevenue = (revenueResult.length > 0) ? revenueResult[0].total : 0;

    // 3. LẤY DỮ LIỆU THẬT CHO BIỂU ĐỒ TĂNG TRƯỞNG (6 tháng gần nhất)
    // Gom nhóm dự án theo tháng và cộng tổng chi phí
    const growthData = await Duan.aggregate([
      { $match: { deleted: false } },
      {
        $group: {
          _id: { $month: "$createdAt" }, // Nhóm theo tháng
          monthlyRevenue: { $sum: { $toDouble: "$chi_phi" } }
        }
      },
      { $sort: { "_id": 1 } } // Sắp xếp từ tháng nhỏ đến lớn
    ]);

    // Xử lý dữ liệu để đẩy ra biểu đồ (Labels và Data)
    const monthsLabel = growthData.map(item => `Tháng ${item._id}`);
    const revenueData = growthData.map(item => item.monthlyRevenue);

    // 4. Thống kê tỷ lệ loại hình (Biểu đồ tròn)
    const bietThuCount = await Duan.countDocuments({ loai_hinh: "BietThu", deleted: false });
    const nhaPhoCount = await Duan.countDocuments({ loai_hinh: "NhaPho", deleted: false });
    const noiThatCount = await Duan.countDocuments({ loai_hinh: "NoiThat", deleted: false });

    // 5. Dự án mới nhất
    const latestProjects = await Duan.find({ deleted: false }).sort({ createdAt: -1 }).limit(5);

    // Render ra giao diện
    res.render("admin/pages/thongke/index", {
      pageTitle: "Thống kê tổng quan PNT DECOR",
      statistic: {
        totalProjects: countProject,
        totalLeads: countLienhe,
        totalArticles: countArticle,
        revenue: totalRevenue.toLocaleString('vi-VN') + " VNĐ"
      },
      chartData: {
        pie: [bietThuCount, nhaPhoCount, noiThatCount],
        lineLabels: monthsLabel, // Truyền tên tháng thật
        lineData: revenueData    // Truyền tiền thật theo tháng
      },
      latestProjects: latestProjects
    });

  } catch (error) {
    console.log("Lỗi thống kê:", error);
    res.redirect("back");
  }
};