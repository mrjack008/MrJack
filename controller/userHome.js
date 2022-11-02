const productHelper=require("../helpers/product-helpers");




module.exports = {
    userHomePage : async function(req, res, next) {
    let user=req.session.loggedIn
    let cartcount=0
    let wishcount=0
    let quantity
    if(req.session.loggedIn){
  
      wishcount=await productHelper.getWishCount(req.session.user._id)
     cartcount=await productHelper.getCartCount(req.session.user._id)
     
    }
   let categorie=await productHelper.getCategories()
    productHelper.getProductcat().then((products)=>{
      
      if(products.products[0].available_quantity==0){
        quantity=[{'1':1}]
        console.log(quantity);
      }
      res.render('users/index',{products,user,cartcount,wishcount,quantity,categorie} );
    })
  },
  userLogin:function(req,res){

    if(req.session.loggedIn){
      console.log("hai");
      res.redirect('/')
    } 
    else{

      res.render('users/login',{layout:'layout2',"loginerr":req.session.loginerror})
      req.session.loginerror=false
   }


},
    userLogout:(req,res)=>{
  
        req.session.destroy();
        res.render('users/login',{layout:'layout2'});  
      },
     
     
     userSignup:function(req,res){
        productHelper.dosignup(req.body).then((response)=>{
          console.log(response)
          req.session.loginerror=response
         res.redirect('/login')
      
        })
        // res.send("account created")
        
      },

      userLoginCheck:(req,res)=>{
        productHelper.dologin(req.body).then((response)=>{
          console.log(response)
          if(response.status){
            req.session.loggedIn=true
            req.session.user=response.user
           
            res.redirect("/")
          }
          else{
            if(response==="user is blocked"){
              req.session.loginerror="User is blocked by admin"
              res.redirect("/login")
      
            }
            else{
              req.session.loginerror="Invalid Username or password"
              console.log("hai")
              res.redirect("/login")
      
            }
          
          }
        })
      
      },
      search:async(req,res)=>{
        wishcount=await productHelper.getWishCount(req.session.user._id)
     cartcount=await productHelper.getCartCount(req.session.user._id)
        products=await productHelper.search(req.query.search)
        res.render('users/allproducts',{layout:'layoutus',products,wishcount,cartcount})
      }
}

