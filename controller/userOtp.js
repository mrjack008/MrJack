const productHelper=require("../helpers/product-helpers");
var sid=process.env.TwiloId
var auth=process.env.TwiloAuth
var YOUR_SERVICE_ID=process.env.TwiloService
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
                    console.log("inned");
                   console.log(data);
                   res.redirect('/login')
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