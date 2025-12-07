const taikhoan=require("../../models/taikhoan.models");
const searchHelper=require ("../../helpers/search.js");
const paginationaccountHelper=require ("../../helpers/pagination.js");
module.exports.Account= async (rep,res)=>{
    try {
        let find={

        }
        const vaitro= rep.query.role;
        const trangthai= rep.query.status;
        if(vaitro){
            find.role=vaitro;
        }
        if(trangthai){
            find.status=trangthai;
        }
              const objectSearch=searchHelper(rep.query);
        if (objectSearch.regex) {
                    find.$or = [
                        { fullName: objectSearch.regex },
                        { email: objectSearch.regex }
                    ];
                }
        const countaccount = await taikhoan.countDocuments(find);
let ojectPagination=paginationaccountHelper({
  currentPage:1,
  limitItem:8
},
rep.query,
countaccount 
 );

  const listTaikhoan= await taikhoan.find(find).sort({ createdAt: "desc" }).limit(ojectPagination.limitItem). skip(ojectPagination.skip);
      res.render("admin/pages/account/index.pug",{
    pageTitle:"Tran quản lí tài khoản ",
    PrefixAdmin: "/admin",
    taikhoan:listTaikhoan,
    role:vaitro,
    status:trangthai,
    keyword:objectSearch.keyword,
    pagination: ojectPagination
});  
console.log(find);
    } catch (error) {
            console.log("Lỗi lấy danh sách dự án:", error);
    res.redirect("back");
    }

}