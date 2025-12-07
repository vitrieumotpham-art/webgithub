const lienhe=require("../../models/lienhe.model");
const searchHelper=require ("../../helpers/search.js");
module.exports.Lienhe= async (rep,res)=>{
    try {
     let find={

      }
      const objectSearch=searchHelper(rep.query);
    if (objectSearch.regex) {
            find.$or = [
                { 
                  fullName: objectSearch.regex },
                  { 
                  email: objectSearch.regex },
                { phone: objectSearch.regex }
            ];
        }
    const listLienhe= await lienhe.find(find);
    console.log(listLienhe);

    res.render("admin/pages/lienhekhachhang/index.pug",{
    lienhe:listLienhe,
    pageTitle:"Tran liên hệ ",
    PrefixAdmin: "/admin",
    keyword:objectSearch.keyword,
});
    } catch (error) {
    console.log("Lỗi lấy danh sách dự án:", error);
    res.redirect("back"); 
    }

}