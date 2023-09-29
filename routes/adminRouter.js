const express=require('express')
const admin_route=express()
 
admin_route.use(express.json())
admin_route.use(express.urlencoded({ extended: true }))

const session=require('express-session')
const config=require('../config/config')
const adminAuth=require('../middleware/adminAuth')

admin_route.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true
}))

admin_route.set('view engine','ejs')
admin_route.set('views','./views/admin')
const adminController=require('../controllers/adminController')

admin_route.get('/',adminAuth.isLogout,adminController.adminLogin)

admin_route.post('/login',adminController.verifyLogin)
admin_route.get('/homepage',adminAuth.isLogin,adminController.loadHome)
admin_route.get('/logout',adminAuth.isLogin,adminController.adminLogout)
admin_route.get('/userspage',adminAuth.isLogin,adminController.userPage)
admin_route.get('/new-user',adminAuth.isLogin,adminController.newUser)
admin_route.post('/create-user',adminAuth.isLogin,adminController.createUser)
admin_route.get('/edit-user',adminAuth.isLogin,adminController.editUserLoad)
admin_route.post('/edit-user',adminAuth.isLogin,adminController.updateUser)
admin_route.get('/delete-user',adminAuth.isLogin,adminController.deleteUser)
admin_route.get('*',(req,res)=>{
    res.redirect('/admin')
})

module.exports=admin_route