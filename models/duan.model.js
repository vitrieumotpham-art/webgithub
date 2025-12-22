    const mongoose = require("mongoose")
    const slug=require('mongoose-slug-updater');
    mongoose.plugin(slug);
const duanSchema=new mongoose.Schema({
    ten_du_an: String,
    slug:{
    type:String,
    slug:"ten_du_an",   
    unique:true
},
    chu_dau_tu: String,
    loai_hinh: String,
    phong_cach: String,
    so_tang: Number,
    dien_tich: Number,
    dia_diem: String,
    nam_thuc_hien: Number,
    trang_thai: String,
    is_noibat: Boolean,
    hinh_anh: [String],
    mo_ta:String, 
    chi_phi: Number ,
    deleted:{
        type:String,
        default:"false"
    },
    deletedAt:Date,
    position:Number
},
{
    timestamps:true 
});
const duan= mongoose.model('duan',duanSchema,"duan");
module.exports= duan ;