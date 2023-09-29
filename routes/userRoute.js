 const express=require('express')
 const user_route=express()
 const path=require('path')
  user_route.set('view engine','ejs')
  user_route.set('views','./views/users')
  // const nocache = require("nocache");
  // user_route.use(nocache())
  
  const config=require('../config/config')

  const session=require('express-session')
  // user_route.use(session({secret:config.sessionSecret}))
  user_route.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true
  }));

//   const bodyParser = require('body-parser')
// user_route.use(bodyParser.urlencoded({ extended: false }))
// user_route.use(bodyParser.json())
  // user_route.use(express.json())
  // user_route.use(express.urlencoded({ extended: true }))
 
 const multer=require('multer') 
 const storage=multer.diskStorage({
    destination:function(req,file,cb){
         cb(null,path.join(__dirname,'../public/userImages'))
    },
    filename:function(req,file,cb){
      const name=Date.now()+'-'+file.originalname
      cb(null,name)
    }
 })

 const upload=multer({storage:storage})

 const auth=require('../middleware/auth')
 const userController=require('../controllers/userController')
 

 user_route.get('/signup',auth.isLogout,userController.loadRegister)
 user_route.post('/signup',upload.single('image'),userController.insertUser)
 user_route.get('/',auth.isLogout,userController.userLogin)
 user_route.get('/login',auth.isLogout,userController.userLogin)

 user_route.post('/login',userController.loginVerify)

 user_route.get('/homepage',auth.isLogin,userController.loadHome)
 user_route.get('/logout',auth.isLogin,userController.userLogout)


 module.exports=user_route