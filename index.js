require("dotenv").config();
const express = require("express");
const path = require('path');
const methodOverride = require("method-override");
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const moment = require('moment');

// Import cấu hình và Routes
const database = require("./config/database");
const routeAdmin = require("./routes/admin/index.router");
const routeClient = require("./routes/client/index.routes");
const localAdminArifix = require("./config/system");

// Import Model để lấy dữ liệu cài đặt chung
const SettingGeneral = require("./models/settings-genneral.model");

const app = express();
const port = process.env.PORT || 3000;

// Kết nối Database
database.connect();

// Cấu hình Views và Static Files
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");
app.use(express.static(`${__dirname}/public`));

// Middleware xử lý dữ liệu từ Form gửi lên
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// Middleware ghi đè phương thức (PATCH, DELETE từ Form)
app.use(methodOverride('_method'));

// Cấu hình Cookie và Session
app.use(cookieParser("ádasdasd"));
app.use(session({
    secret: 'YOUR_VERY_STRONG_AND_RANDOM_SECRET_KEY', 
    resave: false, 
    saveUninitialized: false,
    cookie: { maxAge: 60000 }
}));

// Middleware thông báo (Flash messages)
app.use(flash());

// TinyMCE (Trình soạn thảo văn bản)
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// --- MIDDLEWARE TOÀN CỤC ---
// 1. Biến cục bộ cho file Pug
app.locals.moment = moment;
app.locals.PefixAdmin = localAdminArifix.prefixAdmin;

// 2. Middleware lấy cài đặt chung từ Database truyền ra Header/Footer
app.use(async (req, res, next) => {
    try {
        const settingGeneral = await SettingGeneral.findOne({});
        // Lưu vào app.locals để tất cả các trang (Client & Admin) đều dùng được
        app.locals.settingGeneral = settingGeneral;
        next();
    } catch (error) {
        console.error("Lỗi lấy cài đặt chung:", error);
        next();
    }
});
routeAdmin(app);
routeClient(app);
app.use((req, res) => {
    console.log("Đường dẫn lỗi:", req.method, req.originalUrl);

    res.status(404);

    // (Giả sử bạn có file 404 riêng cho admin)
    if (req.originalUrl.includes("/admin")) {
        res.render("admin/pages/errors/404.pug", {
            pageTitle: "404 Not Found"
        });
        return;
    }

    // Mặc định hiện trang 404 cho khách (Client)
    res.render("client/pages/errors/404.pug", {
        pageTitle: "404 Not Found"
    });
});

// Khởi động Server
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
    console.log(`Open http://localhost:${port}`);
});