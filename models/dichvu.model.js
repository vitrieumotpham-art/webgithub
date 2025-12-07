const mongoose = require("mongoose");
const SchemaDichvu= new mongoose.Schema({
title: String,
slug:String,
description:String,
price:String,
content:String,
thumbnail:String,
status:String,
position:Number,
deleted:Boolean
});
const dichvu= mongoose.model('dichvu',SchemaDichvu,"dichvu") ;
module.exports=dichvu;