const mongoose = require('mongoose');
const {Schema} = mongoose;

const wantCateg  = new Schema({
categoryName:{
    type:String,
    required:true
},
items:[{
    type:mongoose.Types.ObjectId, 
    ref:'wantItem'
}],
Dates:{
    type:String
},
page:{
type:String,
required:true
}
},{timestamps:true})







const wantList = new Schema({
itemName : {
    type:String,
    required:true
},
itemprice:{
    type:Number,
    required:true
},
category:{
    type:String,
    required:true
},
Dates:{
    type:String
}
})

const wantCategory = mongoose.model('wantCategory',wantCateg);
const wantItem = mongoose.model('wantItem',wantList);

module.exports = {wantCategory,wantItem};



