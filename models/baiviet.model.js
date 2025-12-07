const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const BaiVietSchema = new mongoose.Schema({
    title: String,
    slug: String,
    article_category_id: String, 
    description: String,
    content: String,
    thumbnail: String,
    status: String,
    position: Number,
    featured:Boolean,
    views: Number,
    createdBy: {
        account_id: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }, 
    deleted: Boolean
});
module.exports = mongoose.model('baiviet', BaiVietSchema, "baiviet");