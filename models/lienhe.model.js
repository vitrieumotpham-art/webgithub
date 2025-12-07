const mongoose = require("mongoose");
const SchemaLienhe= new mongoose.Schema({
fullName:String,
email:String,
phone:String,
status:String,
message:String,
deleted:Boolean,
createdAt:Date,
updatedAt:Date
});
module.exports=mongoose.model('lienhe',SchemaLienhe,"lienhe" );