const mongoose = require("mongoose");

module.exports.connect = async () => {
    try {
        // Thêm await để đợi kết nối thành công mới chạy tiếp các lệnh sau
        await mongoose.connect(process.env.MONGODB_URL, {

});
        console.log("Connect database success!");
    } catch (error) {
        console.log("Connect database error!");
        console.log(error);
    }
}