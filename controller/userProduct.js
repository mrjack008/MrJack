const productHelper=require("../helpers/product-helpers");




module.exports = {
    products:async function(req,res){
        let userid = req.query.id
        let user=req.session.user
        let wishcount=0
        let cartcount=0
        if(user){
          wishcount=await productHelper.getWishCount(req.session.user._id)
          cartcount=await productHelper.getCartCount(req.session.user._id)

          
        }
        
          pro=await productHelper.getProducts()
          console.log(pro[0]);

          productHelper.getOneProduct(userid).then((products)=>{
            console.log(products);
            if(products.products!=0){
              res.render('users/product',{layout:'layoutus',product:products.products[0 ],userid,wishcount,cartcount,pro,user})
            }
            else{
              res.redirect("/")
            }  
        })
    
      }, 
      allProduct:async function(req,res){
        let user=req.session.loggedIn
        if(user){
          wishcount=await productHelper.getWishCount(req.session.user._id) 
          cartcount=await productHelper.getCartCount(req.session.user._id)
        }
        else{
          wishcount=0
          cartcount=0
        }

        let categorie=await productHelper.getCategories()
        console.log(categorie);
        productHelper.getProducts().then((productss)=>{
          res.render('users/allproducts',{layout:'layoutus',productss,user,wishcount,cartcount,categorie})
        })
      
      }
}