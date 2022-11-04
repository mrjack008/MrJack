var express = require('express');
const { response } = require('../app');

var router = express.Router();
var userhelpers = require("../helpers/product-helpers")
var error=""
require('dotenv').config()
/* GET users listing. */

//<---------------------------------Controller Declaration ------------------------------->
const { Login, CheckLogin, VerifyLogin } = require('../controller/adminHome');
const { users, editUsers, editUsersPost, deleteUsers } = require('../controller/adminUsers');
const { yearlysaless, weeksaless } = require('../helpers/product-helpers');



//<---------------------------------Admin Login ------------------------------->

router.get('/',CheckLogin );
router.get('/login',Login)
router.post('/login',VerifyLogin)  


//<---------------------------------Admin Users ------------------------------->
router.get('/users',users)
router.get('/edit-user',editUsers)
router.post('/edit-user',editUsersPost )
router.get('/delete-user/',deleteUsers)
router.get('/add-user', function (req, res) {
  if(req.session.login){


  res.render('admin/adduser', { layout: 'layout1' })
  }
  else{
    res.redirect('/admin/login')
  }
})
router.post('/add-user', (req, res) => {
  console.log(req.body);
  if(req.session.login){

  userhelpers.addUser(req.body, (result) => {
    res.render('admin/adduser', { layout: 'layout1' })
  });
}
else{
  res.redirect('/admin/login')
}
})


router.get('/orders',async function(req,res){
  if(req.session.login){
    let orders=await userhelpers.getordersadmin()

    res.render("admin/ordersss",{ layout: 'layout1', orders })
  }
  else{
    res.redirect('/admin/login')
  }
})

router.get('/sales',(req,res)=>{
  res.render("/admin/sales",{layout:'layout1'})
})

router.get('/add-product', function (req, res) {
  if(req.session.login){

    userhelpers.catt().then((products)=>{
    
      res.render('admin/addproduct', { layout: 'layout1' ,cat:products})
    })

  }
  else{
    res.redirect('/admin/login')
  }
})
router.post('/add-product', (req, res) => {
  console.log("i am here")
  console.log(req.body);
  if(req.session.login){

  userhelpers.addProduct(req.body).then((id) => {
    console.log(id);
    let image = req.files.filebutton
    console.log(image);
    image.mv('./public/product-images/' + id + '.jpg', (err, done) => {
      if (!err) {
        res.redirect('/admin/products')
      }
    })

  })
} 
 else{
  res.redirect('/admin/login')
}
})
router.get('/products', function (req, res) {
  console.log(req.session.login);
  if(req.session.login){

  userhelpers.getProducts().then((products) => {

    res.render('admin/products', { layout: 'layout1', products })
  })
  }
  else{  
      console.log("hellods");

    res.redirect('/admin/login')
  }
}) 
router.get('/offerproducts', function (req, res) {
  console.log(req.session.login);
  if(req.session.login){

  userhelpers.getProducts().then((products) => {

    res.render('admin/productoffer', { layout: 'layout1', products })
  })
  }
  else{
      console.log("hellods");

    res.redirect('/admin/login')
  }
})
router.post('/addoffer',async function(req,res){
  console.log(req.body);
  await userhelpers.addOffer(req.body.productId,req.body.productOffer)
  res.json({status:true})
  

})
// router.post('/add-product',(req,res)=>{
//   console.log(req.boody);
//   console.log(req.files.filebutton);
//   userhelpers.getProduct(req.body)
//   res.redirect('/admin/add-product')
// })
router.get('/delete-product/', (req, res) => {
  let userid = req.query.id
  if(req.session.login){

  console.log("delete")
  console.log(userid)
  userhelpers.deleteProduct(userid).then((response) => {
    res.redirect("/admin/products")
  })
}
else{
  console.log("hello");

  res.redirect('/admin/login')
}
})
router.get('/index',async (req,res)=>{
  dailysales= await userhelpers.dailysaless()
  monthsales= await userhelpers.weeksaless()
  yearlysales= await userhelpers.yearlysaless()
 

  todaysa= await userhelpers.todaysaless()
   userss= await userhelpers.getalluserscount()
  console.log (todaysa);
  if(todaysa[0]){
    totalsales= todaysa[0].qty

    totalprice= todaysa[0].dailySales
  }

  else{
    totalsales=0
  }
  console.log(dailysales);
  console.log("dsfdsf");
  monthlysales= monthsales.monthlySales;
  yearlysales= yearlysales.yearlySales
  console.log(yearlysales);
  console.log(totalprice,totalsales);
  res.render('admin/index',{ layout: 'layout1' ,dailysales,totalsales,totalprice,userss,monthsum:monthsales.monthsum,monthorder:monthsales.monthorder,yearlysum:monthsales.monthsum,yearlyorder:monthsales.monthorder,monthlysales,yearlysales})
})
router.get('/delete-categorie/', (req, res) => {
  let userid = req.query.id
  if(req.session.login){

  console.log("delete")
  console.log(userid)
  userhelpers.deleteCat(userid).then((response) => {
    res.redirect("/admin/categories")
  })
}

else{
  res.redirect('/admin/login')
}
})
router.get('/delete-subscribers/', (req, res) => {
  let userid = req.query.id
  if(req.session.login){

  console.log("delete")
  console.log(userid)
  userhelpers.deleteSub(userid).then((response) => {
    res.redirect("/admin/subscribers")
  })
}

else{
  res.redirect('/admin/login')
}
})

router.get('/delete-coupen/', (req, res) => {
  let userid = req.query.id
  if(req.session.login){

  console.log("delete")
  console.log(userid)
  userhelpers.deleteCoupen(userid).then((response) => {
    res.redirect("/admin/coupens")
  })
}

else{
  res.redirect('/admin/login')
}
})
router.get('/add-categorie', function (req, res) {
  if(req.session.login){


  res.render('admin/addcategorie', { layout: 'layout1' })
  }
  else{
    res.redirect('/admin/login')
  }
})
router.post('/add-cat', (req, res) => {
  console.log(req.files.filebutton);
  if(req.session.login){

  userhelpers.addCat(req.body).then((id)=> {
    let image = req.files.filebutton
    console.log(image);
    image.mv('./public/categorie-images/' + id + '.jpg', (err, done) => {
      if (!err) {
        console.log("non roo");
        res.redirect('/admin/categories')
      }
      else{
        console.log(err);
      }
    })
  });
}
else{
  res.redirect('/admin/login')
}
})
router.get('/add-coupens', function (req, res) {
  if(req.session.login){


  res.render('admin/addcoupens', { layout: 'layout1' })
  }
  else{
    res.redirect('/admin/login')
  }
})
router.post('/add-coupen', (req, res) => {
  console.log(req.body);
  if(req.session.login){

  userhelpers.addCoupen(req.body, (result) => {
    res.render('admin/addcoupens', { layout: 'layout1' })
  });
}
else{
  res.redirect('/admin/login')
}
})
router.get('/edit-product', function (req, res) {
 
  if(req.session.login){

  let id = req.query.id
  
  userhelpers.getOneProduct(id).then((products)=>{
    
    res.render('admin/editproduct', { layout: 'layout1',product:products.products[0],cat:products.cat})
  })
  }
  else{
    res.redirect('/admin/login')
  }
})
router.get('/edit-categorie', function (req, res) {

  if(req.session.login){

  let id = req.query.id
  
  userhelpers.getCategorie(id).then((categorie)=>{
    console.log(categorie[0]);
    res.render('admin/edit-categorie', { layout: 'layout1',categorie:categorie[0]})
  })
  }
  else{
    res.redirect('/admin/login')
  }
})
router.get('/subscribers',async function (req, res) {

  if(req.session.login){
  subscriber= await userhelpers.getSubscribers()
  res.render('admin/subscribers',{layout:'layout1',subscriber})
  }
  else{
    res.redirect('/admin/login')
  }
})
router.post('/edit-categorie', function (req, res) {
  console.log(req.body)
  if(req.session.login){

  
  userhelpers.editCategorie(req.body).then((id)=>{
    if(req.files){
      let image = req.files.filebutton
      console.log(req.body.id);
      image.mv('./public/categorie-images/' + req.body.id+ '.jpg', (err, done) => {
        if (!err) {
          res.redirect('/admin/products')
        }
      })
    }
    else{
      res.redirect('/admin/categories')
    }

   
  })

  }
  else{
    res.redirect('/admin/login')
  }
})
router.post('/edit-product', function (req, res) {
  console.log(req.body)
  if(req.session.login){

  
  userhelpers.editProduct(req.body).then((id)=>{
    if(req.files){
      let image = req.files.filebutton
      console.log(id[0]._id);
      image.mv('./public/product-images/' + id[0]._id + '.jpg', (err, done) => {
        if (!err) {
          res.redirect('/admin/products')
        }
      })
    }
    else{
      res.redirect('/admin/products')
    }

   
  })

  }
  else{
    res.redirect('/admin/login')
  }
})
router.get('/categories', function (req, res) {
  if(req.session.login){

  userhelpers.getCategories().then((products) => {
 console.log(products)
    res.render('admin/category', { layout: 'layout1', products })
  })
  }
  else{
    res.redirect('/admin/login')
  }
})
router.get('/coupens', function (req, res) {
  if(req.session.login){

  userhelpers.getCoupen().then((coupens) => {
 console.log(coupens)
    res.render('admin/coupen', { layout: 'layout1', coupens })
  })
  }
  else{
    res.redirect('/admin/login')
  }
})
router.get('/logout',(req,res)=>{
  req.session.login=false
  req.session.destroy();
  res.redirect('/admin/login')
})
router.get('/block-user', function (req, res) {
  
  if(req.session.login){
    let id = req.query.id
  console.log(id)
  userhelpers.blockUser(id)
  res.redirect('/admin/users')
 
  }
  else{
    res.redirect('/admin/login')
  }
})
router.get('/unblock-user', function (req, res) {
  
  if(req.session.login){
    let id = req.query.id
  console.log(id)
  userhelpers.unblockUser(id)
  res.redirect('/admin/users')
 
  }
  else{
    res.redirect('/admin/login')
  }
})
router.get('/order-details',async function(req,res){
  if(req.session.login){
    let orders=await userhelpers.detailsorders(req.query.id)
    let products=await userhelpers.getOrderProducts(req.query.id)
    if(orders){
      res.render("admin/ordersdetails",{ layout: 'layout1', orders:orders[0],products })
    }
    else{
      res.redirect('/admin/orders')
    }
 

  }
  else{
    res.redirect('/admin/login')
  }
})
router.get('/temp',function(req,res){
 res.render("admin/pp",{layout:'layout1'})
})
router.post('/order-status', function (req, res) {
  
  if(req.session.login){
    let id = req.query.id
  console.log(id)
  console.log(req.body);
  userhelpers.orderstatus(id,req.body.status)
  res.redirect('/admin/orders')
 
  }
  else{
    res.redirect('/admin/login')
  }
})
router.get('/edit-banner',function(req,res){
  res.render('admin/edit-banner',{layout:'layout1',banner:req.query.banner})
})
router.post('/edit-banner',function(req,res){
 console.log(req.body.banner);
  let image = req.files.filebutton
  image.mv('./public/banner/' + req.body.banner + '.jpg', (err, done) => {
    if (!err) {
      res.redirect('/')
    }
    
  })
})
router.get('/banner',function(req,res){
  if(req.session.login){
    res.render('admin/banners',{layout:'layout1'})
 
  }
  else{
    res.redirect('/admin/login')
  }

})

module.exports = router;
