const duan=require("../../models/duan.model");
const baiviet=require("../../models/baiviet.model");
const lienhe=require("../../models/lienhe.model");
module.exports.dashboard = async (req, res) => {
try {
          const [countduan, countbaiviet, countlienhe,countduannoibat] = await Promise.all([
                duan.countDocuments(),
                baiviet.countDocuments(),
                lienhe.countDocuments() ,
                duan.countDocuments({is_noibat:'true'})// Hoặc { type: { $nin: ['image', 'video'] } } nếu muốn đếm các loại còn lại
            ]);
            const listbaiviiet= await baiviet.find(); 
             const listlienhe= await lienhe.find(); 
    res.render("admin/pages/dashboard/index.pug",{
    pageTitle:"trang tổng quan"
    ,PrefixAdmin: "/admin",
    baiviet:listbaiviiet,
        lienhe:listlienhe,
    thongke:{
        duan:countduan,
        baiviet:countbaiviet,
        lienhe:countlienhe,
        duannoibat:countduannoibat
    }
});
} catch (error) {
         console.log("Lỗi lấy danh sách dự án:", error);
        res.redirect("back");
}

}