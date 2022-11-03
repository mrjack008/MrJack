
const productHelper=require("../helpers/product-helpers");



 
module.exports={
    editUser:(req,res)=>{
        console.log("HHH");
        productHelper.editUser(req.body)
        console.log(req.body);
        console.log(req.session.user);
        res.redirect('/logout')
      },
    mailSubscribers:(req,res)=>{
        console.log(req.body);
        productHelper.subscribers(req.body).then((id)=>{
          console.log(id);
        })
        
      },
    dashboard:async function(req,res){
        console.log(req.session.user);
        let adress=await productHelper.getAddress(req.session.user._id)
        cartcount=await productHelper.getCartCount(req.session.user._id)
        wishcount=await productHelper.getWishCount(req.session.user._id)
        let orders=await productHelper.getorders(req.session.user._id)
        
        res.render('users/dashboard',{layout:'layoutus',user:req.session.user,orders,cartcount,wishcount,adress})
      },
      deleteaddress:async function(req,res){
        console.log(req.params.id);
        productHelper.deleteAddress(req.params.id)
        res.redirect('/dashboard')  
      }
      
}