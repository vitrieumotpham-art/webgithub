
const duan=require("../../models/duan.model");
module.exports.duan= async (req,res)=>{
    try {
        const duans=await duan.find({});
   res.render("client/pages/du_an/index.pug",{
    pageTitle:"Về chúng tôi",
    duan: duans
});
    } catch (error) {
            console.log("Lỗi lấy danh sách dự án:", error);
        res.redirect("/duan"); 
    }
    console.log(duan);
}