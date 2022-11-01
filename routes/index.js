var express = require('express');
const { response } = require('../app');
var router = express.Router();
var productHelper=require("../helpers/product-helpers");
const { route } = require('./admin');
var sid='ACbf0c631982540a1c06c30b2b91636c98'
var auth='ee1c07732fa0adf3e7f340802b1339a0'
var YOUR_SERVICE_ID='VAc9d2efa76a0997fbb18a594b24494d1d'
var client= require('twilio')(sid,auth)
var phone
const paypal = require('paypal-rest-sdk');
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AY5epxoAX_7irEORDbPI-c5DxO2emxvXpbOiBOvv9UyzRdnS3TZ7cVzcmx_xhau-xKPXMI3aKP7yYm3y',
  'client_secret': 'EPLjkVYqo5NTQvGEDA5J-01XklHtm6QA_tREg5ZPSC96rFkHA1hYgGBqAZ7w6BcB8GnBg5fz9MDa1QLK'
});
const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()

  }else{
    res.redirect('/login')
  }
}



//<---------------------------------Controller Declaration ------------------------------->
const { userHomePage, userLogin, userLogout, userSignup, userLoginCheck, search} = require('../controller/userHome');
const {products, allProduct} = require('../controller/userProduct');
const { cart, changeQuantity, addCart, deleteCart, checkout } = require('../controller/userCart');
const { wishlist, addWishlist, deleteWishlist } = require('../controller/userWishlist');
const { placeOrder, orders, orderCancel, orderDetails } = require('../controller/userOrder');
const { phoneNumber, otp, verifyotp } = require('../controller/userOtp');
const { paypalOrder, razorpay, coupen } = require('../controller/userPayment');
const { saveaddress } = require('../controller/adminUsers');




//<---------------------------------Home Page ------------------------------->

router.get('/',userHomePage);
router.get('/search',verifyLogin,search)

//<---------------------------------Login functions ------------------------------->

router.get('/login',userLogin)
router.get('/logout',userLogout)
router.post('/home',userSignup)
router.post('/home1',userLoginCheck)

//<---------------------------------Otp functions ------------------------------->
router.get("/phonenumber",phoneNumber );
router.get("/otp",otp );
router.get("/verify",verifyotp);
 

//<---------------------------------Product functions ------------------------------->

router.get('/product',products)
router.get('/allproduct',allProduct)

//<---------------------------------Cart functions ------------------------------->


router.get('/cart',verifyLogin,cart)
router.post('/change-quantity/',changeQuantity)
router.get('/add-to-cart/:id',addCart)
router.post('/delete-pro',deleteCart)
router.get('/checkout',checkout)
router.post('/saveaddress',saveaddress)

//<---------------------------------Wish functions ------------------------------->
router.get('/wishlist',verifyLogin,wishlist)
router.get('/add-to-wish/:id',addWishlist)
router.delete('/delete-wish-pro',deleteWishlist)


//<---------------------------------Order functions ------------------------------->

router.post('/place-order',placeOrder)
router.get('/orders',orders)
router.get('/order-cancel',orderCancel)
router.get('/order-details',orderDetails)


//<---------------------------------Payment functions ------------------------------->


router.post('/paypal',paypalOrder)
router.post('/verify-payment',razorpay)
router.post('/coupen',coupen)

router.post('/edit',(req,res)=>{
  console.log("HHH");
  productHelper.editUser(req.body)
  console.log(req.body);
  console.log(req.session.user);
  res.redirect('/logout')
})
router.post('/mail',(req,res)=>{
  console.log(req.body);
  productHelper.subscribers(req.body).then((id)=>{
    console.log(id);
  })
  
})



router.get('/categorie',verifyLogin,async (req,res)=>{
  console.log("haii");
  if(req.query.categorie){
    console.log("ASjhadshjaskjaj");

    console.log(req.query.categorie);
    wishcount=await productHelper.getWishCount(req.session.user._id)
    cartcount=await productHelper.getCartCount(req.session.user._id)
       productss=await productHelper.getCategoriePage(req.query.categorie)
       let categorie=await productHelper.getCategories()

       console.log(productss);
       res.render('users/allproducts',{layout:'layoutus',productss,wishcount,cartcount,categorie})
  }

})







router.get('/dashboard',verifyLogin,async function(req,res){
  console.log(req.session.user);

  cartcount=await productHelper.getCartCount(req.session.user._id)
  wishcount=await productHelper.getWishCount(req.session.user._id)
  let orders=await productHelper.getorders(req.session.user._id)
  
  res.render('users/dashboard',{layout:'layoutus',user:req.session.user,orders,cartcount,wishcount})
})






module.exports = router;

