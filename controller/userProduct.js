const productHelper=require("../helpers/product-helpers");




module.exports = {
    products:async function(req,res){
        let userid = req.query.id
        let user=req.session.user

        if(user){
          wishcount=await productHelper.getWishCount(req.session.user._id)
          cartcount=await productHelper.getCartCount(req.session.user._id)

          pro=await productHelper.getProducts()
          console.log(pro[0]);

          productHelper.getOneProduct(userid).then((products)=>{
            if(products){
              res.render('users/product',{layout:'layoutus',product:products.products[0 ],userid,wishcount,cartcount,pro,user})
            }
            else{
              res.redirect("/")
            }
        })
        }
        else{
          res.redirect('/login')
        }
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