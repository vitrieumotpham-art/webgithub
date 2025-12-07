const danhgia=require("../../models/danhgia.models");
const searchHelper=require ("../../helpers/search.js");
const paginationphanhoiHelper=require ("../../helpers/pagination.js");
module.exports.Phanhoi= async (rep,res)=>{
try {
    let find={

    }
    const trangthai=rep.query.status ;
     const sosao=rep.query.rating; 
     if(sosao){
        find.rating=sosao;
     }
     if(trangthai){
        find.status=trangthai;
     }
    const objectSearch=searchHelper(rep.query);
     if (objectSearch.regex) {
                 find.project=objectSearch.regex;
             }
            const countdanhgia = await danhgia.countDocuments(find);
let ojectPagination=paginationphanhoiHelper({
  currentPage:1,
  limitItem:6
},
rep.query,
countdanhgia 
 );
    const listDanhgia= await danhgia.find(find).sort({ createdAt: "desc" }).limit(ojectPagination.limitItem). skip(ojectPagination.skip);
    res.render("admin/pages/phanhoi/index.pug",{
    pageTitle:"Tran phản hồi ",
    PrefixAdmin: "/admin",
    danhgia:listDanhgia,
    status:trangthai,
    keyword:objectSearch.keyword,
    rating:sosao,
    pagination: ojectPagination
});
console.log(find);

} catch (error) {
        console.log("Lỗi lấy danh sách dự án:", error);
    res.redirect("back"); 
}
}