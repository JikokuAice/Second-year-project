const express = require('express')
const app = express();
const path = require('path')
const passport = require('passport')
const Esession = require('express-session')
const {User} = require('./schema/registerSchema');

const {  mongoose } = require('mongoose');
const statics = path.join(__dirname,'./fontend');
const homeRoute = require('./routes/homeRoute')
const forgetRoute = require('./routes/forgetRoute')

// const budgetSchema = require('./schema/userWallet')

const dbu = 'mongodb+srv://Ayush:Ayushlac321@cluster1.eqgfnr5.mongodb.net/Register?retryWrites=true&w=majority'
mongoose.connect(dbu).then((r)=>{
    return app.listen(5000,()=>{
        console.log('server is working')
    })
}).catch((err)=>{
    console.log(err)
})

const {needCategory,needItem}= require('./schema/needSchema')
const {wantCategory,wantItem}=require('./schema/wantSchema')

const {localAuth,sessionAuth}= require('./backend/passport-config')
localAuth(passport)


app.use(express.static(statics))
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(Esession({
    secret:'aice',resave:false,saveUninitialized:false
   }))
app.use(passport.initialize())
app.use(passport.session())
app.use('/home',homeRoute)
app.use('/forget',forgetRoute)


app.get('/',(req,res)=>{
   res.sendFile(path.resolve(__dirname,'./fontend/login.html'))
})

app.get('/register',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'./fontend/signin.html'))
})



// app.get('/need',())

//for handling post req of registration
app.post('/signup',async (req,res)=>{
    let {name,username,password1}=req.body;
   let user = await User.findOne({username:username})
  
   if(user){
  return res.sendFile(path.resolve(__dirname,'./redirect/userExist.html'))
   }

    try{
    const signup = new User({
        name:name,
        username:username,
        password:password1, 
    })
   signup.save()
   .then((r)=>{
        res.redirect('/')
    })
    .catch((err)=>console.log(err)) 
    
}catch(err){
  res.sendFile(path.resolve(__dirname,'./redirect/serverErr.html'))
}
})

app.post('/login',passport.authenticate("local",{failureRedirect:"/failure",successRedirect:'/home'}),(req,res)=>{

})

app.get('/failure',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'./redirect/auth.html'))
})

app.post('/logout',(req,res,next)=>{
    req.session.destroy(function (err) {
        res.redirect('/'); 
      });
})

app.get('/needs',sessionAuth,(req,res)=>{
res.sendFile(path.resolve(__dirname,'./fontend/need.html'))
})

app.get('/wants',sessionAuth,(req,res)=>{
    res.sendFile(path.resolve(__dirname,'./fontend/want.html'))
})
    

app.get('/addcategory',sessionAuth,(req,res)=>{
    res.sendFile(path.resolve(__dirname,'./fontend/addCategory.html'))

})
    
    
app.post('/addcategory/needs',sessionAuth,async (req,res)=>{

    /*we are getting current date with time using new Date method and then  convert 
the valur we get to 29/02/2024, 19:16:51 this string which can be split(',') at "29/02/2024, 19:16:51" which will split string to two
      array from , and we can use arrayindex to get 29/02/2024 only and send it to mongo for future use*/

var a=  new Date().toLocaleString().split(',')

const need = new needCategory({
categoryName:req.body.Nname,
page:'Needs',
Dates:a[0]
})
await need.save().then((e)=>{

    console.log("need saved")
})

let needs = await User.updateOne({_id:req.user.id},{$push:{Ncategory:need._id}})

})




app.get('/addcategory/getwant',sessionAuth,async (req,res)=>{
  //* we are finding user in mongoDB by our id saved in seesion from login
  //*then we use populate to populate the Wcategory array with collections from 
  //*Wants category and executing it and getting value in variable popu using async/await
   let popu = await User.findOne({_id:req.user._id}).populate('Wcategory').exec();
  res.send(popu.Wcategory)
})



 app.post('/addcategory/wants',sessionAuth,async (req,res)=>{
    console.log(req.body.Wname);
     var a=  new Date().toLocaleString().split(',')
     const want = new wantCategory({
     categoryName:req.body.Wname,
     page:'Wants',
     Dates:a[0]
     })
     await want.save()
     let ak = await User.updateMany({_id:req.user.id},{$push:{Wcategory:want._id}});
     console.log(ak);
     })


     
    

app.post('/needs/items',async (req,res)=>{
const {Name,Price,categoryName} = req.body;
const Sdate = new Date().toLocaleString().split(',')[0];
 const item = new needItem({
 itemName:Name,
 itemprice:Price,
 category:categoryName,
 Dates:Sdate
})

await item.save()


let ak = await needCategory.findOneAndUpdate({categoryName:categoryName},{$push:{items:item._id}});

res.send('ok')

});


app.get('/needs/item',async (req,res)=>{
    let populated =await User.findOne(req.user._id);

let arr = populated.Ncategory;
const arrays = [];
for(let e of arr){
    let objId = e.toString();
  let data = await needCategory.findOne({_id:objId}).populate('items').exec();
  
  if(data!=null){
  arrays.push(data)
  }
}
res.send(arrays)
})


app.post('/wants/items',async (req,res)=>{
    const {Name,Price,categoryName} = req.body;

    const Sdate = new Date().toLocaleString().split(',')[0];

     const item = new wantItem({
     itemName:Name,
     itemprice:Price,
     category:categoryName,
     Dates:Sdate
    })
    
    await item.save()
    
    
    let ak = await wantCategory.findOneAndUpdate({categoryName:categoryName},{$push:{items:item._id}});
    
    console.log(ak);
    
    });



    app.get('/wants/item',async (req,res)=>{
        let populated =await User.findOne(req.user._id);
    
    //we getting every WCategory id that si pushed in User DB.
    let arr = populated.Wcategory;

    //initializing empty array
    const arrays = [];


    //using for each loop to get each object individually.
    for(let e of arr){

        //converting ObjID('ID') to 'ID'
        let objId = e.toString();
//finding each want category and pupulating items DB in it .
      let data = await wantCategory.findOne({_id:objId}).populate('items').exec();
      
      if(data!=null){
        //pushing each populated wants category to array  
      arrays.push(data)
      }
    }
    //sending arrays in front end.
    res.send(arrays)
    })

