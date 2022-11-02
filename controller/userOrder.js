
const productHelper=require("../helpers/product-helpers");



 
module.exports = {
    placeOrder:async(req,res)=>{
        console.log(req.body);
          let products=await productHelper.getcartprolist(req.body.userId)
          let totalPrice=0
          if(req.body.total){
            totalPrice=parseFloat
            (req.body.total)
            console.log(totalPrice);
          }
          else{
            totalPrice=await productHelper.getTotalAmount(req.body.userId)
          }
          if(req.body.plan){
            productHelper.orderPlace(req.body,products,totalPrice).then((orderId)=>{
              if(req.body['payment']==='cod'){
                console.log("cod paid");
                res.json({codSuccess:true})
              }
              else if(req.body['payment']==='paypal'){
                console.log("paypal");
                res.json({paypal:true, orderId,totalPrice})
              }
              else{
                productHelper.generateRazorpay(orderId,totalPrice).then((response)=>{
                  res.json({response})
                })
              }
          
           
            })
          }
          else{
            
          }

          console.log("hai");
         
        },

    orders:async(req,res)=>{
        console.log("hai");
        
        if(req.session.user){
          let user=req.session.user
          cartcount=await productHelper.getCartCount(req.session.user._id)
          wishcount=await productHelper.getWishCount(req.session.user._id)
          let orders=await productHelper.getorders(req.session.user._id)
      
        res.render('users/orders',{layout:'layoutus',orders,cartcount,wishcount,user})
        }else{
          res.redirect('/login')
        }
      },
    orderCancel:async(req,res)=>{
        if(req.session.user){
          let id = req.query.id
          console.log(id)
          productHelper.orderstatus(id,req.query.status)
          res.redirect('/orders')
        }
        else{
          res.redirect('/')
        }
      
      },
    orderDetails:async(req,res)=>{
        console.log("hai");
        if(req.session.user){
          wishcount=await productHelper.getWishCount(req.session.user._id)
     cartcount=await productHelper.getCartCount(req.session.user._id)
          let orders=await productHelper.detailsorders(req.query.id)
          let products=await productHelper.getOrderProducts(req.query.id)
      console.log(orders);
      if(orders){
        console.log(cartcount,wishcount);
        res.render('users/od',{layout:'layoutus',products,orders:orders[0],cartcount,wishcount})

      }
      else{
        res.redirect("/")
      }
        }else{
          res.redirect('/')
        }
        
      }
}
