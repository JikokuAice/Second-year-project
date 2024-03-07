const path = require('path')
const LocalStrategy = require('passport-local').Strategy;
const {User} = require('../schema/registerSchema')


const localAuth = (passport)=>{
  passport.use(new LocalStrategy(async (username,password,done)=>{
 try{
const user = await User.findOne({username:username})
if(!user){
  return done(null,false)
  
}
if(user.password !== password){
  return done(null,false)
}

return done(null,user)
}catch(err){
  return(err,false)
}
}))

passport.serializeUser((user,done)=>{
  done(null,user.id)
})

passport.deserializeUser(async (id,done)=>{
try{
const user = await User.findById(id)
done(null,user)
}catch(err){
done(err,false)
}
})


}


const sessionAuth = (req,res,next) =>{
if(req.user){return next()}
res.sendFile(path.resolve(__dirname,'../redirect/auth.html'))
}



module.exports={localAuth,sessionAuth}