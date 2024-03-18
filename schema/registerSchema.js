const mongoose = require('mongoose')
let {Schema} = mongoose;
const register = new Schema({
name:{
    type:String,
    required:true,
   
},
username:{
    type:String,
    unique:true,
    required:true
},
password:{
    type:String,
    required:true
},
wallets:{
    type:Schema.Types.ObjectId,
    ref:'wallet'
},
Wcategory:[{
    type:Schema.Types.ObjectId,
    ref:'wantCategory'

}],
Ncategory:[{
    type:Schema.Types.ObjectId,
    ref:'needCategory'
}]
},{timestamps:true})





const budgetSchema = new Schema({
    income: {
        type: Number,
    },
    expense: {
        type: Number,
    },
    Wants: {
        type: Number,
    },
    Needs: {
        type: Number,

    },needExpense:{

        type:Number
    },wantExpense:{

        type:Number
    }
    ,
    Saving: {
        type: Number,
    },
    currentDate:{
        type:Date
        
    }
});





const  User = mongoose.model('User',register);
const wallet = mongoose.model('wallet',budgetSchema)

module.exports={User,wallet}