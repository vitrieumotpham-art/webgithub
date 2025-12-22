require("dotenv").config();
const methodOverride = require("method-override");
const express = require("express");

const flash = require('express-flash');
const database = require("./config/database");
const cookieParser = require('cookie-parser'); // <--- THÊM DÒNG NÀY
const session = require('express-session');
const routeAdmin = require("./routes/admin/index.router");
const routeClient = require("./routes/client/index.routes");
const multer=require('multer');

const localAdminArifix = require("./config/system");

const app = express();
const port = process.env.PORT || 3000;

database.connect();
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");
app.use(express.urlencoded({
    extended: true
}));

app.use(methodOverride('_method'));
app.use(express.static(`${__dirname}/public`));
app.use(cookieParser("ádasdasd"));
app.use(session({
    secret: 'YOUR_VERY_STRONG_AND_RANDOM_SECRET_KEY', 
    resave: false, 
    saveUninitialized: false, 

}));
app.use(flash());
//end flash

app.locals.PefixAdmin = localAdminArifix.prefixAdmin;

// Cấu hình định tuyến (Routes)
routeAdmin(app);
routeClient(app);

// Khởi động Server
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
    console.log(`Open http://localhost:${port}`);
});