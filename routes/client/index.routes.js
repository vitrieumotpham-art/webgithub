const chungtoi=require("./about_us.routes");
const productHome=require("./home.routers.js");
const duan=require("./duan.router.js");
const khach=require("./khach.router.js");
const lienhe=require("./lienhe.router.js");
const tintuc=require("./tintuc.router.js");
const dichvu=require("./dichvu.router.js");
module.exports=(app)=>{
app.use("/",productHome);

app.use("/about_us",chungtoi);
app.use("/duan",duan);
app.use("/khach",khach);
app.use("/lienhe",lienhe);
app.use("/tintuc",tintuc);
app.use("/dichvu",dichvu);

}