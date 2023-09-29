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

const loadRegister = async (req, res) => {

    try {
        res.render('signup')

    } catch (error) {
        console.log(error.message);
    }

}
const insertUser = async (req, res) => {
    console.log(req.body);
    const spassword = await securePassword(req.body.password)
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            password: spassword,
            image: req.file.filename,
            is_admin: 0,

        })
        const userData = await user.save()
        if (userData) {
            res.render('signup', { message: "your registration has been success" })
        } else {
            res.render('signup', { message: 'your registration is failed' })
        }
    } catch (error) {
        console.log(error.message);
    }
}
const userLogin = async (req, res) => {
    try {
        res.render('login')
    } catch (error) {
        console.log(error.message);
    }
}
const loginVerify = async (req, res) => {
    try {
        
        const email = req.body.email
        const password = req.body.password
        const userData = await User.findOne({ email:email })
        
        if (userData) {
            
            const passwordMatch = await bcrypt.compare(password,userData.password);
            console.log(passwordMatch);
            if (passwordMatch) {
                console.log("matched");
                req.session.user_id=userData._id
                
               res.redirect('/homepage')
            } else {
                console.log('not matched');
                res.render('login', { message: 'password or email was incorrect' })
            }
        } else {
            console.log('not matcheed2');
            
            res.render('login', { message: 'password or email was incorrect' })
        }
    } catch (error) {
        console.log(error.message);
    }
}
const loadHome=async (req,res)=>{
    try {
       const userData=await User.findById({_id:req.session.user_id})
       
            res.render('homepage',{user:userData})
        
        
    } catch (error) {
        console.log(error.message);
    }
}
const userLogout=async(req,res)=>{
    
    try {
        req.session.destroy()
        console.log('logout successfully');
        res.redirect('/')
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadRegister,
    insertUser,
    userLogin,
    loginVerify,
    loadHome,
    userLogout
}