const productHelper=require("../helpers/product-helpers");
require('dotenv').config()


const paypal = require('paypal-rest-sdk');
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': process.env.PaypalClientID ,
  'client_secret': process.env.PaypalSecret
});

module.exports = {
  paypalOrder:(req,res,next)=>{
  const create_payment_json = {
   "intent": "sale",
   "payer": {
       "payment_method": "paypal"
   },
   "redirect_urls": {
       "return_url": "http://localhost:3000/orders",
       "cancel_url": "http://localhost:3000/cancel"
   },
   "transactions": [{
       "item_list": {
           "items": [{
               "name": "Red Sox Hat",
               "sku": "001",
               "price": req.body.grandTotal,
               "currency": "USD",
               "quantity": 1
           }]
       },
       "amount": {
           "currency": "USD",
           "total": req.body.grandTotal
       },
       "description": "Hat for the best team ever"
   }]
  };
  
  paypal.payment.create(create_payment_json, function (error, payment) {
  if (error) {
     console.log(error);
  } else {
     for(let i = 0;i < payment.links.length;i++){
       if(payment.links[i].rel === 'approval_url'){
         res.json(payment.links[i].href);
       }
     }
  }
  });
  
  
  },

  razorpay:(req,res)=>{
    console.log("hhhhhhh");
    console.log(req.body);
    productHelper.verifyPayment(req.body).then(()=>{
     console.log("innnnnn");
     productHelper.changePaymentStatus(req.body['order[receipt]']).then(()=>{
       console.log("payment success");
       res.json({status:true})
     })
    }).catch((err)=>{
     console.log(err);
     console.log("eeeeerrrorr");
     res.json({status:false,errMsg:''})
    })
    },
    coupen:async (req,res)=>{
        console.log(req.body.coupon);
        total=await productHelper.getTotalAmount(req.session.user._id)
        productHelper.coupen(req.body.coupon,req.session.user._id).then((response)=>{
         console.log(response);
         res.json({response,total})
        })
        }
}