
const productHelper=require("../helpers/product-helpers");



 
module.exports={
    cart:async function(req,res){
        console.log("haiii");
        let products=await productHelper.getCartProducts(req.session.user._id)
        let user=req.session.user
        let total=null
        let cartcount=0;
        cartcount=await productHelper.getCartCount(req.session.user._id)
        wishcount=await productHelper.getWishCount(req.session.user._id)
        if(cartcount!=0){
          total=await productHelper.getTotalAmount(req.session.user._id)
        }
       
       
        
        res.render('users/cart',{layout:'layoutus',products,user,total,cartcount,wishcount})
      
      },
      changeQuantity:(req,res,next)=>{

        productHelper. changeProductQuantity(req.body).then(async(response)=>{
          response.total=await productHelper.getTotalAmount(req.body.user)
          // console.log(req.body);
          res.json(response)
        })
      },
      addCart:(req,res)=>{

 

        console.log("API CALLED");
        productHelper.addToCart(req.session.user._id,req.params.id).then(()=>{
          res.json({status:true})
        })
    
    
    
    
    },
    deleteCart:(req,res)=>{
        console.log("hai");
        productHelper.deleteCartPro(req.session.user._id,req.body.proid)
        res.json({status:true})
      },
    checkout:async(req,res)=>{

        if(req.session.loggedIn){
          let cartcount=0;
          cartcount=await productHelper.getCartCount(req.session.user._id)
  
          wishcount=await productHelper.getWishCount(req.session.user._id)
          if(cartcount!=0){

            let coupenss=await productHelper.getCoupen()
            console.log(coupenss);
            let total=await productHelper.getTotalAmount(req.session.user._id)
            let adress=await productHelper.getAddress(req.session.user._id)
            console.log(adress);
            res.render('users/checkout',{layout:'layoutus',total,user:req.session.user,coupenss,adress,cartcount,wishcount})
          }
         else{
          res.redirect('/')
         }
        }
        else{
          
          res.redirect('/login')
        }
      }
}