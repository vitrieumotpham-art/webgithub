const mongoose = require("mongoose");

const doinguSchema = new mongoose.Schema({
    fullname: String,
    position: String,
    slug: String,
    description: String,
    avatar: String,
    socials: { // Object chứa link mxh
        facebook: String,
        twitter: String,
        linkedin: String,
        instagram: String,
        zalo: String
    },
    status: String,
    order: Number,
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Doingu = mongoose.model('doingu', doinguSchema, "doingu");
module.exports = Doingu;