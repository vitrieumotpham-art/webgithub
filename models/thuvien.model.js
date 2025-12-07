const mongoose= require("mongoose");
const thuvienSchema= new mongoose.Schema({
filename:String,
type:String,
size:String,
url:String,
deleted:Boolean,
createdAt: Date,
updatedAt:Date

});
module.exports=mongoose.model('anhthuvien', thuvienSchema,"anhthuvien"); //"anhthuvien": ten bang trong cơ sở dữ liệu