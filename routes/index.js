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
const { editUser, mailSubscribers, dashboard } = require('../controller/userFunctions');
const { categories } = require('../controller/adminHome');




//<---------------------------------Home Page ------------------------------->

router.get('/',userHomePage);
router.get('/search',verifyLogin,search)
router.get('/dashboard',verifyLogin,dashboard)
router.get('/categorie',verifyLogin,categories)
router.post('/edit',editUser)
router.post('/mail',mailSubscribers)

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

module.exports = router;




















