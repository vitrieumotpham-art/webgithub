const systemConfig=require("../../config/system");
const dashBoardRoute=require("./dashboard.routes");
const Project=require("./Project.router");
const Baiviet=require("./baiviet.router");
const Dichvu=require("./dichvu.router");
const Account=require("./account.router");
const Hinhanh=require("./hinhanh.router");
const Lienhe=require("./lienhe.router");
const Phanhoi=require("./phanhoi.router");
const Doingu=require("./doingu.router");

module.exports=(app)=>{
  const path_admin=systemConfig.prefixAdmin;
app.use(path_admin+"/dashboard",dashBoardRoute);
app.use(path_admin+"/Project",Project);
app.use(path_admin+"/Baiviet",Baiviet);
app.use(path_admin+"/Dichvu",Dichvu);
app.use(path_admin+"/Account",Account);
app.use(path_admin+"/Hinhanh",Hinhanh);
app.use(path_admin+"/Lienhe",Lienhe);
app.use(path_admin+"/Phanhoi",Phanhoi);
app.use(path_admin+"/Doingu",Doingu);
} 
