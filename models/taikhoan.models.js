const mongoose= require("mongoose");
const taikhoanSchema= new mongoose.Schema({

username:String,
password:String,
email:String,
fullName:String,
role:String,
status:String,
createdAt:Date
});
const taikhoan=mongoose.model('taikhoan',taikhoanSchema,"taikhoan");
module.exports=taikhoan;