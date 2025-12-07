const doingu=require("../../models/doingu.model");
const searchHelper=require ("../../helpers/search.js");

module.exports.Doingu= async  (rep,res)=>{
    try {
      let find={

      }
const trangthai= rep.query.status ;
if(trangthai){
  find.status=trangthai;
}
      const objectSearch=searchHelper(rep.query);
if (objectSearch.regex) {
            find.$or = [
                { fullname: objectSearch.regex },
                { position: objectSearch.regex }
            ];
        }
console.log(find);
    const listDoingu=await doingu.find(find);
    res.render("admin/pages/doingu/index.pug",{
    pageTitle:"Tran quản lí đội ngũ ",
    PrefixAdmin: "/admin",
    doingu:listDoingu,
    status:trangthai,
       keyword:objectSearch.keyword,
});
  
    } catch (error) {
    console.log("Lỗi lấy danh sách dự án:", error);
    res.redirect("back"); 
    }

}