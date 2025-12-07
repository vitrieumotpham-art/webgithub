const methodOverride=require("method-override");
const express = require("express");
require("dotenv").config();

const database=require("./config/database");

const routeAdmin = require("./routes/admin/index.router");
const routeClient = require("./routes/client/index.routes");

const localAdminArifix = require("./config/system"); 

const app = express();
const port = process.env.PORT || 3000; 

database.connect();
app.set("views", "./views");
app.set("view engine", "pug");

// BƯỚC 1: Thêm middleware để phân tích dữ liệu form POST (Body Parser)
// Điều này cho phép Express đọc dữ liệu từ form, bao gồm cả tham số _method.
app.use(express.urlencoded({ extended: true }));

// BƯỚC 2: Sử dụng method-override (Đúng thứ tự, sau Body Parser)
app.use(methodOverride('_method'));
app.use(express.static("public"));


app.locals.PefixAdmin = localAdminArifix.prefixAdmin;

// Cấu hình định tuyến (Routes)
routeAdmin(app); 
routeClient(app); 

// Khởi động Server
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
    console.log(`Open http://localhost:${port}`); 
});