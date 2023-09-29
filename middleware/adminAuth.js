// const isLogin=async (req,res,next)=>{
//     try {
//         if(req.session.user_id){
          
//         }else{
//             res.redirect('/admin')
//         }
//         next()
//     } catch (error) {
//         console.log(error.message);
//     }
// }
// const isLogout=async (req,res,next)=>{
//   try {
//     if(req.session.user_id){
//         res.redirect('/admin/homepage')
//     }
//   } catch (error) {
//     console.log(error.message);
//   }
//   next()
// }
// module.exports={
//     isLogin,isLogout
// }

const isLogin = async (req, res, next) => {
  try {
      if (req.session.user_id) {
          next();
      } else {
          res.redirect('/admin');
      }
  } catch (error) {
      console.log(error.message);
      res.status(500).send('Server Error');
  }
}

const isLogout = async (req, res, next) => {
  try {
      if (req.session.user_id) {
          res.redirect('/admin/homepage');
      } else {
          next();
      }
  } catch (error) {
      console.log(error.message);
      res.status(500).send('Server Error');
  }
}

module.exports = {
  isLogin,
  isLogout
}