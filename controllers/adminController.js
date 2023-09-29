const User = require('../models/userModel')
const bcrypt = require('bcrypt')

const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10)
        return passwordHash
    } catch (error) {
        console.log(error.message);
    }
}

const adminLogin = async (req, res) => {
    try {
        res.render('login')
    } catch (error) {
        console.log(error.message);
    }

}
const verifyLogin = async (req,res)=>{
    try {
        const email = req.body.email
        const password = req.body.password
        const userData = await User.findOne({ email: email })
        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password)
            if (passwordMatch) {
                console.log(passwordMatch);
                if (userData.is_admin === 0) {
                    res.render('login', { message: "your email and password was incorrect" })
                } else {
                    req.session.user_id = userData._id
                    
                    res.redirect('/admin/homepage')
                }
            } else {
                res.render('login', { message: "your email and password was incorrect" })
            }

        } else {
            res.render('login', { message: "your email and password was incorrect" })
        }

    } catch (error) {
        console.log(error.message);
    }
}
const loadHome=async (req,res)=>{
    try {
        
        const userData=await User.findById({_id:req.session.user_id})
        
        res.render('home',{admin:userData})
    } catch (error) {
        console.log(error.message);
    }
}
const adminLogout=async (req,res)=>{
    try {
        req.session.destroy()
        
    res.redirect('/admin')

    } catch (error) {
        console.log(error.message);
    }
}
const userPage=async (req,res)=>{
    try {
        var search=""

        if(req.query.search){
            search=req.query.search
        }
        const userData=await User.find({is_admin:0,
        $or:[
            {name:{$regex: '.*'+search+'.*'}},
            {email:{$regex:'.*'+search+'.*'}},
            {mobile:{$regex:'.*'+search+'.*'}}
        ]
    })

        res.render('userdetails',{users:userData})
    } catch (error) {
        console.log(error.message);
    }
}
const newUser=async (req,res)=>{
    try {
        console.log(req.body);
        res.render('newuser')
    } catch (error) {
        console.log(error.message);
    }
}
const createUser=async(req,res)=>{
    try {
        const name=req.body.name
        const email=req.body.email
        const mobile=req.body.mobile
        const password=req.body.password

          const spassword=await securePassword(password)
          const user=User({
            name:name,
            email:email,
            mobile:mobile,
            password:spassword,
            is_admin:0,
            is_verified:0
          })
          const userData=await user.save()
          if(userData){
            res.redirect('/admin/homepage')
          }else{
               res.render('newuser',{message:"something went wrong"})
          }

    } catch (error) {
        console.log(error.message);
    }
}
const editUserLoad=async (req,res)=>{
    try {
        const id=req.query.id
        const userData=await User.findById({_id:id})
        if(userData) {
            res.render('edit-user',{user:userData})
        }else{
            res.redirect('/admin/homepage')
        }
       
    } catch (error) {
        console.log(error.message);
    }
}

const updateUser =async (req,res)=>{
    try {
      const userData=await  User.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.name,
        email:req.body.email,
    mobile:req.body.mobile,
is_verified:req.body.verify}})

res.redirect('/admin/homepage')

    } catch (error) {
        console.log(error.message);
    }
}
const deleteUser=async (req,res)=>{
    try {
        const id=req.query.id
        
        const userData=await User.deleteOne({_id:id})
        res.redirect('/admin/homepage')
    } catch (error) {
        console.log(error.message);
    }
}
module.exports = {
    adminLogin,
    verifyLogin,
    loadHome,
    adminLogout,
    userPage,
    newUser,
    createUser,
    editUserLoad,
    updateUser,
    deleteUser
}