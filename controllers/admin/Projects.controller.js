const Duan = require("../../models/duan.model"); 
const searchHelper=require ("../../helpers/search.js");
const paginationHelper=require ("../../helpers/pagination.js");
module.exports.duan = async (req, res) => {
  try {
    let find = {
    };
    const trangThai = req.query.trang_thai;
    const noibat = req.query.is_noibat;
    const loaihinh = req.query.loai_hinh;
    const sotang = req.query.so_tang;
    const namthuchien = req.query.nam_thuc_hien;
    if (trangThai) {
      find.trang_thai = trangThai;
    }

    if (noibat) {
      find.is_noibat = noibat;
    }

    if(loaihinh){
      find.loai_hinh=loaihinh;
    }
     if(sotang){
      find.so_tang=sotang;
    }
     if(namthuchien){
      find.nam_thuc_hien=namthuchien;
    }
  const objectSearch=searchHelper(req.query);
   if(objectSearch.regex){
      find.ten_du_an=objectSearch.regex;
    }
  
    // pagination
    const countDuan = await Duan.countDocuments(find);
let ojectPagination=paginationHelper({
  currentPage:1,
  limitItem:8
},
req.query,
countDuan 
 );



    const listDuAn = await Duan.find(find).sort({ createdAt: "desc" }).limit(ojectPagination.limitItem). skip(ojectPagination.skip);
    res.render("admin/pages/project/index.pug", {
      pageTitle: "Quản Lý Dự Án",
      duan: listDuAn, 
      trang_thai: trangThai,
      is_noibat: noibat,
      loai_hinh: loaihinh,
      so_tang: sotang,
      nam_thuc_hien: namthuchien,
      keyword:objectSearch.keyword,
      pagination: ojectPagination
    });

  } catch (error) {
    console.log("Lỗi lấy danh sách dự án:", error);
    res.redirect("back"); 
  }
};
module.exports.changeStatus= (req, res)=>{
  res.send("ok");
console.log(req.params);
}