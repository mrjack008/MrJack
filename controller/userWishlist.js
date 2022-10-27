
const productHelper=require("../helpers/product-helpers");




module.exports = {
    wishlist:async function(req,res){
      wishcount=await productHelper.getWishCount(req.session.user._id)
      cartcount=await productHelper.getCartCount(req.session.user._id)
        let products=await productHelper.getWishProducts(req.session.user._id)
        res.render('users/wishlist',{layout:'layoutus',products,wishcount,cartcount})
      },

    addWishlist:(req,res)=>{
        console.log("API CALLED");
        productHelper.addToWish(req.session.user._id,req.params.id).then(()=>{
          res.json({status:true})
        })
      
      },
    deleteWishlist:(req,res)=>{
        console.log("hai");
        productHelper.deleteWishPro(req.session.user._id,req.body.proid)
        res.json({status:true})
      }
}
