const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const BaiVietSchema = new mongoose.Schema({
    title: String,
    slug: {
        type: String,
        slug: "title", // Tự động tạo slug từ trường title
        unique: true
    },
    article_category_id: String, 
    description: String,
    content: String,
    thumbnail: String,
    status: String,
    position: Number,
    featured: Boolean,
    views: Number,
    createdBy: {
        account_id: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }, 
    deleted: {
        type: Boolean,
        default: false // QUAN TRỌNG: Phải là false khi mới tạo
    },
    deletedAt: {
        account_id: String,
        deletedAt: Date
    }, 
}, {
    timestamps: true // Tự động thêm trường updatedAt và createdAt cấp cao nhất
});

module.exports = mongoose.model('baiviet', BaiVietSchema, "baiviet");