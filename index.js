const mongoose=require('mongoose')
mongoose.connect("mongodb://127.0.0.1:27017/project_db")
const path=require('path')
const PORT=process.env.PORT||8080



const express=require('express')
const app=express()

const disable = (req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '1');
  next();
}
app.use(disable);


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const nocache = require("nocache");
  app.use(nocache())
app.use('/static',express.static(path.join(__dirname,'public')));

// for user route
 const userRoute=require('./routes/userRoute')
 app.use('/',userRoute)

//  for admin route
const adminRoute=require('./routes/adminRouter')
app.use('/admin',adminRoute)


app.listen(PORT,()=>{
    console.log("Server is running");
})