
var userhelpers = require("../helpers/product-helpers")

var express = require('express');
const { response } = require('../app');

var router = express.Router();
var error=""

module.exports = {
    users:function (req, res) {
        if(req.session.login){
          userhelpers.getallusers().then((users) => {
      
          res.render("admin/users", { layout: 'layout1', users })
        })
        }
        else{
          res.redirect('/admin/login')
        }
      },
    editUsers: function (req, res) {

        if(req.session.login){
      
        let Name = req.query.name
        let Email = req.query.email
        let phone = req.query.phone
        let id=req.query.id
        console.log(Name)
        res.render('admin/edituser', { layout: 'layout1', Name, Email,phone,id })
        }
        else{
          res.redirect('/admin/login')
        }
      },
      editUsersPost:function (req, res) {
        if(req.session.login){
      
        console.log(req.body)
        res.render('admin/edituser', { layout: 'layout1' })
        userhelpers.editUser(req.body)
        }
        else{
          res.redirect('/admin/login')
        }
      },
    deleteUsers: (req, res) => {
        let userid = req.query.id
        if(req.session.login){
      
        console.log("delete")
        console.log(userid)
        userhelpers.deleteUser(userid).then((response) => {
          res.redirect("/admin/users")
        })
      }
      else{
        res.redirect('/admin/login')
      }
      },
      saveaddress:(req,res)=>{
        console.log(req.body);
        productHelper.saveadress(req.body)
        res.redirect('/checkout')
      }
}


