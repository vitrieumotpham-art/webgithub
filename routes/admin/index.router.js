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
  const path_admin = "/" + systemConfig.prefixAdmin;
  app.get(path_admin, (req, res) => {
    res.redirect(path_admin + "/dashboard");
  });
app.use(path_admin+"/dashboard",dashBoardRoute);
app.use(path_admin+"/project",Project);
app.use(path_admin+"/baiviet",Baiviet);
app.use(path_admin+"/dichvu",Dichvu);
app.use(path_admin+"/account",Account);
app.use(path_admin+"/hinhanh",Hinhanh);
app.use(path_admin+"/lienhe",Lienhe);
app.use(path_admin+"/phanhoi",Phanhoi);
app.use(path_admin+"/doingu",Doingu);
} 
