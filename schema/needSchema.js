const mongoose = require('mongoose');
const {Schema} = mongoose;

const needCateg  = new Schema({
categoryName:{
    type:String,
    required:true
},
items:[{
    type:mongoose.Types.ObjectId, 
    ref:'Item'
}],
Dates:{
    type:String
},
page:{
type:String,
required:true
}
},{timestamps:true})







const needList = new Schema({
itemName : {
    type:String,
  
},
itemprice:{
    type:Number,
  
},
category:{
    type:String,
  
},
Dates:{
    type:String
}
})

const needCategory = mongoose.model('needCategory',needCateg);
const needItem = mongoose.model('Item',needList);

module.exports = {needCategory,needItem};



