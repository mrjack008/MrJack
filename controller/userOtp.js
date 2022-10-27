const productHelper=require("../helpers/product-helpers");
var sid='ACbf0c631982540a1c06c30b2b91636c98'
var auth='ee1c07732fa0adf3e7f340802b1339a0'
var YOUR_SERVICE_ID='VAc9d2efa76a0997fbb18a594b24494d1d'
var client= require('twilio')(sid,auth)
var phone



module.exports = {
    phoneNumber:(req, res, next) => {
        if (req.session.loggedIn) {
           res.redirect("/");
        } else {
           res.render("users/enter-number");
        }
      },
    otp:(req, res,next) => {
        phone=req.query.phonenumber
        productHelper.getphone(phone).then((count)=>{
         console.log(count.count);
           if(count.count!=0){
             if(req.session.loggedIn){
               res.redirect("/")
             }else {
               client.verify
                  .services(YOUR_SERVICE_ID) // Change service ID
                  .verifications.create({
                   to: `+91${req.query.phonenumber}`,
                   channel: "sms",
                  })
                  .then((data) => {
                   res.render('users/otp');
                     // res.status(200).send({
                     //    message: "Verification is sent!!",
                     //    phonenumber: req.query.phonenumber,
                     //    data,
                     // });
                  }).catch((data)=>{
                   console.log(data);
                })
               
             }
           }
           else{
             req.session.loginerror="Number Is Not Registered!"
             res.redirect('/login')
           }
        })
         
       },
       verifyotp:async (req, res) => {
        userdetails=await productHelper.detailphone(phone)
        console.log(userdetails[0]);
        if(req.session.loggedIn){
         
          res.redirect("/")
        }else{
      client.verify
        .services(YOUR_SERVICE_ID) // Change service ID
        .verificationChecks.create({
          to: `+91${phone}`,
          
          code: req.query.otp,
        })
        .then((data) => {
          if (data.status === "approved") {
            req.session.loggedIn=true;
            req.session.user=userdetails[0];
            console.log("in");
          
            res.redirect('/');
          } else {
            console.log("out");
            res.status(400).send({
              message: "User is not Verified!!",
              data,
            });
          }
        }).catch((data)=>{
          console.log(data);
       })
       
      }
      },
}