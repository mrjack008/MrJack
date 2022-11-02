var userhelpers = require("../helpers/product-helpers")

var express = require('express');
const { response } = require('../app');

var router = express.Router();
var error=""
require('dotenv').config()

module.exports = {
    Login:function(req,res){
        console.log(req.session.login)
      
        if(req.session.login){
          console.log("hai");
          res.redirect('/admin/products')
      
        }
        else{
        let admin=req.session.admin
        console.log(admin)
      
         
          res.render("admin/login",{layout:'layout2',admin,error})
        }
      },
    VerifyLogin:function(req,res){
        if(req.body.adminname===process.env.adminusernsme&&req.body.adminpass===process.env.adminpass){
          console.log("inn");
          req.session.login=true
          req.session.admin="admin"
            res.redirect("/admin/products")
      
          
          
        }
        else{
          error="invalid username and password"
          res.redirect('/admin/login')
          setTimeout(() => {
            error=""
          }, 2000);
          req.session.login=false
        }
        
      
      },
    CheckLogin:function (req, res, next) {
        req.session.login==false
        res.redirect('/admin/login')
    },
    categories:async (req,res)=>{
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
    
    }
}