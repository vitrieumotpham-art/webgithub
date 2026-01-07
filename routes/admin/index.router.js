const systemConfig=require("../../config/system");
const dashBoardRoute=require("./dashboard.routes");
const authmidle=require("../../middlewares/admin/authen.middlewares");
const Project=require("./Project.router");
const Baiviet=require("./baiviet.router");
const Dichvu=require("./dichvu.router");
const Account=require("./account.router");
const Lienhe=require("./lienhe.router");
const Phanhoi=require("./phanhoi.router");
const Doingu=require("./doingu.router");
const doanhmuc=require("./doanhmuc.route");
const roles=require("./roles.router");
const auth=require("./auth.router");
const myaccount=require("./my-account.router");
const thongke=require("./thongke.router");
const setting=require("./setting.router");

module.exports = (app) => {
  const path_admin = "/" + systemConfig.prefixAdmin;

  // 1. Những route KHÔNG CẦN đăng nhập (ví dụ: login)
  app.use(path_admin + "/auth", auth);

  // 2. Những route BẮT BUỘC phải đăng nhập
  // Sử dụng middleware một lần duy nhất cho tất cả các route bên dưới
  app.use(path_admin, authmidle.requireAuth); 

  // Bây giờ tất cả các route dưới này mặc định ĐÃ CÓ res.locals.role
  app.get(path_admin, (req, res) => {
    res.redirect(path_admin + "/dashboard");
  });

  app.use(path_admin + "/dashboard", dashBoardRoute);
  app.use(path_admin + "/roles", roles); // Bây giờ đã an toàn
  app.use(path_admin + "/project", Project);
  app.use(path_admin + "/baiviet", Baiviet);
  app.use(path_admin + "/dichvu", Dichvu);
  app.use(path_admin + "/account", Account);
  app.use(path_admin + "/lienhe", Lienhe);
  app.use(path_admin + "/phanhoi", Phanhoi);
  app.use(path_admin + "/doingu", Doingu);
  app.use(path_admin + "/doanhmuc", doanhmuc);
  app.use(path_admin + "/my-account", myaccount);
  app.use(path_admin + "/thongke", thongke);
  app.use(path_admin + "/settings", setting);
}
