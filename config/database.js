const mongoose = require("mongoose");

module.exports.connect = async () => {
    try {
        // Thêm await để đợi kết nối thành công mới chạy tiếp các lệnh sau
        await mongoose.connect(process.env.MONGODB_URL, {
    maxPoolSize: 10, // Duy trì tối đa 10 kết nối đồng thời
    serverSelectionTimeoutMS: 5000, // Thử kết nối trong 5s, nếu không được thì báo lỗi ngay
    socketTimeoutMS: 45000, // Đóng kết nối nếu không có phản hồi sau 45s
});
        console.log("Connect database success!");
    } catch (error) {
        console.log("Connect database error!");
        console.log(error);
    }
}