const mongoose=require("mongoose");
const danhgiaSchema=new mongoose.Schema({
 clientName:String,
project:String,
rating:Number,
content:String,
status:String,
createdAt:Date
});
const danhgia=mongoose.model('danhgia',danhgiaSchema,'danhgia');
module.exports=danhgia;