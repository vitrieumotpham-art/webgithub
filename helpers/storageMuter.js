const multer = require('multer');

module.exports = () => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            // Thiết lập thư mục đích
            cb(null, "./public/uploads"); 
        },
        
        filename: function (req, file, cb) {
            // Tối ưu hóa tính duy nhất: Kết hợp timestamp và một số ngẫu nhiên
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9); 
            
            // Đặt tên file: [chuỗi_duy_nhất]-[tên_gốc_file]
            cb(null, `${uniqueSuffix}-${file.originalname}`); 
        }, // 🚨 SỬA LỖI: Đã thêm dấu phẩy (,) bị thiếu ở cuối thuộc tính filename
    });
    
    return storage;
};