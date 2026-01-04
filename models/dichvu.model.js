const mongoose = require("mongoose");
const slug=require('mongoose-slug-updater');
mongoose.plugin(slug);
const SchemaDichvu= new mongoose.Schema({
title: String,
slug:{
    type:String,
    slug:"title",
    unique:true
},
description:String,
price:String,
content:String,
thumbnail:String,
status:String,
position:Number,
deleted:{
    type:Boolean,
    default:false 
},

createdBy:{
        accountID:String,
        createAt:{
            type:Date,
            default:Date.now
        }
    },
    deletedBy:{
        accountID:String,
        deletedAt:Date
    },

},

{
    timestamps:true 
});
const dichvu= mongoose.model('dichvu',SchemaDichvu,"dichvu") ;
module.exports=dichvu;