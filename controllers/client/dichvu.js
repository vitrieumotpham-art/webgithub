const dichvu=require("../../models/dichvu.model");

module.exports.dichvu=(req,res)=>{
res.render("client/pages/dichvu/index.pug",{
    pageTitle:"dichvu"
});

}

module.exports.dichvu= async (req,res)=>{
    try {
        const Dichvu=await dichvu.find({});
   res.render("client/pages/dichvu/index.pug",{
    pageTitle:"dịch vụ",
    dichvus: Dichvu
});
    } catch (error) {
            console.log("Lỗi lấy danh sách dự án:", error);
        res.redirect("/duan"); 
    }
}