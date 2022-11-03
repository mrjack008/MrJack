const { resolve } = require('path')
const { reject } = require('promise')
var db = require('../config/connection')
const bcrypt = require('bcrypt')
var objectId = require('mongodb').ObjectId
var collection = require('../config/collections')
const { response } = require('../app')
const { ObjectID, ObjectId } = require('bson')
const { ConnectionCheckOutFailedEvent } = require('mongodb')
const collections = require('../config/collections')
require('dotenv').config()
const Razorpay = require('razorpay');
const { options } = require('../routes')
var instance = new Razorpay({
    key_id: process.env.RazorPayId,
    key_secret: process.env.RazorPaysecret,
  });
const paypal = require('paypal-rest-sdk');
 
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AY5epxoAX_7irEORDbPI-c5DxO2emxvXpbOiBOvv9UyzRdnS3TZ7cVzcmx_xhau-xKPXMI3aKP7yYm3y',
  'client_secret': 'EPLjkVYqo5NTQvGEDA5J-01XklHtm6QA_tREg5ZPSC96rFkHA1hYgGBqAZ7w6BcB8GnBg5fz9MDa1QLK'
});
module.exports = {
    addProduct: (productdata) => {
        return new Promise(async(resolve, reject) => {
            
           db.get().collection(collection.PRODUCT_COLLECTION).insertOne(productdata).then((id)=>{
                resolve(id.insertedId.toString())
           })
             
        })
    },
    subscribers:(mail)=>{
        return new Promise(async(resolve, reject) => {

            db.get().collection(collection.SUBSCRIBERS_COLLECTION).insertOne(mail).then((id)=>{
                 resolve(id)
            })
              
         })
    },
    getSubscribers: () => {
        return new Promise(async (resole, reject) => {
            let products =await db.get().collection(collection.SUBSCRIBERS_COLLECTION).find().toArray()

            resole(products)
        })
    },
    getProducts: () => {
        return new Promise(async (resole, reject) => {
            let products =await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()

            resole(products)
        })
    },
    addOffer: (id,offer) => {
        return new Promise(async (resole, reject) => {
            let products =await db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:ObjectId(id)},{$set:{productoffer:parseInt(offer)}})

            resole(products)
        })
    },
    getCategories: () => {
        return new Promise(async (resole, reject) => {
            let products =await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()

            resole(products)
        })
    },
    getCoupen: () => {
        return new Promise(async (resole, reject) => {
            let coupen =await db.get().collection(collection.COUPEN_COLLECTION).find().toArray()

            resole(coupen)
        })
    },
    getAddress: (id) => {
        return new Promise(async (resole, reject) => {
            console.log(id);
            adress= await db.get().collection(collection.ADRRESS_COLLECTION).find({userId:id}).toArray()
            console.log(adress);
            resole(adress)
        })
    },
    getProductcat: () => {
        return new Promise(async (resole, reject) => {
            let productcat =await db.get().collection(collection.PRODUCT_COLLECTION).find({product_categorie: 'Magician'}).toArray()
            let products =await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()

            let a={productcat,products}
            resole(a)
        })
    },
    getCategoriePage:(categorie)=>{
        return new Promise (async(resolve,reject)=>{
            let productcat =await db.get().collection(collection.PRODUCT_COLLECTION).find({product_categorie: categorie}).toArray()
            resolve(productcat)
        })
    },
    getOneProduct: (id) => {
        return new Promise(async (resole, reject) => {
            if(id==undefined){
                let id=1
            }
            console.log(id);
            if(id.length==24){
                let products =await db.get().collection(collection.PRODUCT_COLLECTION).find({_id:ObjectId(id)}).toArray()
                let cat =await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()
                let pc={products,cat}
               console.log(pc);
                resole(pc)
            }
            else{
                let products =0
                let cat =await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()
                let pc={products,cat}
               console.log(pc);
                resole(pc)
                console.log("hai");
                resole()
            }
        })
    },
    getCategorie: (id) => {
        return new Promise(async (resole, reject) => {
            if(id==undefined){
                let id=1
            }
            console.log(id);
            if(id.length==24){
                let products =await db.get().collection(collection.CATEGORY_COLLECTION).find({_id:ObjectId(id)}).toArray()
    
                resole(products)
            }
            else{
                
                resole()
            }
        })
    },
    catt:async ()=>{
        return new Promise(async(resolve,reject)=>{
            let cat =await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()
            resolve(cat)
        })
 
    },
    addCat: async (user) => {
        return new Promise (async(resolve,reject)=>{
            let namee = await db.get().collection(collection.CATEGORY_COLLECTION).count({ categorie: user.Name })
        // console.log(namee)
        if (namee != 0) {
            console.log("error")
            resolve("error")
        }
        else {
            let cat=user.Name

                db.get().collection(collection.CATEGORY_COLLECTION).insertOne({categorie:cat}).then((data) => {
                    console.log(data);
                    resolve(data.insertedId.toString())
                })
          
            
        }
        })
        

    },
    addCoupen: async (user, callback) => {
        console.log(user.Name)
        let namee = await db.get().collection(collection.COUPEN_COLLECTION).count({ coupen: user.Name })
        // console.log(namee)
        if (namee != 0) {
            console.log("error")
            callback("error")
        }
        else {
            let cat=user.Name
            let price=user.Price
            let d=user.Description
            db.get().collection(collection.COUPEN_COLLECTION).insert({coupen:cat,offer:price,Description:d,User:[]}).then((data) => {
                console.log(data);
                callback(data)
            })
        }

    },
    addUser: async (user, callback) => {
        console.log(user)
        let namee = await db.get().collection(collection.USER_COLLECTION).count({ Name: user.Name })
        console.log(namee)
        if (namee != 0) {
            console.log("error")
            callback("error")
        }
        else {
            user.password = await bcrypt.hash(user.password, 10)
            db.get().collection(collection.USER_COLLECTION).insertOne(user).then((data) => {
                callback(data)
            })
        }

    },
    getallusers: () => {
        return new Promise(async (resolve, reject) => {
            let users = await db.get().collection(collection.USER_COLLECTION).find().toArray()

            resolve(users)
        })
    },
    getalluserscount: () => {
        return new Promise(async (resolve, reject) => {
            let users = await db.get().collection(collection.USER_COLLECTION).find().count()
            console.log(users);
            resolve(users)
        })
    },
    dosignup: (userdata) => {
        console.log(userdata)

        console.log(userdata.Name)
        return new Promise(async (resolve, reject) => {
            let namee = await db.get().collection(collection.USER_COLLECTION).count({ Name: userdata.Name })
            let phone = await db.get().collection(collection.USER_COLLECTION).count({ phone: userdata.phone })
            let email = await db.get().collection(collection.USER_COLLECTION).count({ Email: userdata.Email })
            console.log(userdata.phone);
            console.log(phone);
            if (namee != 0 || phone !=0 ||email!=0) {
                resolve("Signup Failed")
            } else {
                userdata.password = await bcrypt.hash(userdata.password, 10)
                db.get().collection(collection.USER_COLLECTION).insertOne(userdata).then((data) => {
                    resolve("Signup Success")
                })
            }


        })

    },
    dologin:(userdata)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus=false
            let response={}

            let userr=await db.get().collection(collection.USER_COLLECTION).findOne({Name:userdata.Name})
            if(userr){

                console.log(userdata.password)
                if(userr.status){
                    console.log("user is blocked")
                    resolve("user is blocked")
                }
                else{bcrypt.compare(userdata.password,userr.password).then((status)=>{
                    if(status){
                        console.log("logined")
                        response.user=userr
                        response.status=true

                        resolve( response)
                    }else{
                        console.log("failed")
                        resolve({status:false})
                    }
                })
            }}else{
                console.log("failed5")
                resolve({status:false})
            }
        })
    },  
    deleteUser: (userid) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).deleteOne({ _id: objectId(userid) }).then((response) => {
                console.log(response)
                resolve(response)
            })
        })
    },
    deleteAddress: (userid) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ADRRESS_COLLECTION).deleteOne({ _id: objectId(userid) }).then((response) => {
                console.log(response)
                resolve(response)
            })
        })
    },
    deleteCat: (userid) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.CATEGORY_COLLECTION).deleteOne({ _id: objectId(userid) }).then((response) => {
                console.log(response)
                resolve(response)
            })
        })
    },
    deleteCoupen: (userid) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.COUPEN_COLLECTION).deleteOne({ _id: objectId(userid) }).then((response) => {
                console.log(response)
                resolve(response)
            })
        })
    },
    deleteProduct: (userid) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({ _id: objectId(userid) }).then((response) => {
                console.log(response)
                resolve(response)
            })
        })
    },

    editUser: (user) => {
        return new Promise(async (resolve, reject) => {
            console.log(user.id)

            user.password = await bcrypt.hash(user.password, 10)
            db.get().collection('users').updateOne({ _id: objectId(user.id) }, { $set: { Name: user.Name, Email: user.Email, password: user.password ,phone: user.phone} }).then((response) => {
                console.log(response)
                resolve(response)
            })
        })
    },
    editCategorie: (user) => {
        return new Promise(async (resolve, reject) => {
            

          
            db.get().collection(collection.CATEGORY_COLLECTION).updateOne({ _id: objectId(user.id) }, { $set: { categorie:user.Name} }).then((response) => {
                console.log(response)
                resolve(response)
            })
        })
    },
    editProduct: (user) => {
        return new Promise(async (resolve, reject) => {
            console.log(user.product_id);
           let a= await db.get().collection(collection.PRODUCT_COLLECTION).find({product_id:user.product_id}).toArray()
           if(user.available_quantity==0){
            console.log("inned");
            let b= await db.get().collection(collection.PRODUCT_COLLECTION).updateOne({ product_id: user.product_id }, { $set: { product_name: user.product_name ,product_categorie: user.product_categorie,product_price: user.product_price,product_description: user.product_description,product_author: user.product_author} })
            await db.get().collection(collection.PRODUCT_COLLECTION).updateOne({product_id: user.product_id},{$unset:{available_quantity:''}})
        await  db.get().collection(collection.CART_COLLECTION).updateOne({product_id: user.product_id},{$pull:{products:{item:user.product_id}}}) 
        }
           else{
            let b= await db.get().collection(collection.PRODUCT_COLLECTION).updateOne({ product_id: user.product_id }, { $set: { product_name: user.product_name ,product_categorie: user.product_categorie,product_price: user.product_price,available_quantity: user.available_quantity,product_description: user.product_description,product_author: user.product_author} })
           }
           
           console.log(a)
               resolve(a)
        })
    },
    blockUser: (id) => {
        return new Promise(async (resolve, reject) => {
            console.log(id)

            db.get().collection('users').updateOne({ _id: objectId(id) }, { $set: { status: "block" } })
        })
    },
    unblockUser: (id) => {
        return new Promise(async (resolve, reject) => {
            console.log(id)

            db.get().collection('users').updateOne({ _id: objectId(id) }, { $unset: { status: "block" } })
        })
    },
    getphone: (phone) => {
        return new Promise(async (resolve, reject) => {
            let count = await db.get().collection(collection.USER_COLLECTION).find({phone:phone}).count()
            let user = await db.get().collection(collection.USER_COLLECTION).find({phone:phone}).toArray()
            let details={count,user}
            console.log(details);
            resolve(details)
        })
    },
    detailphone:(phone)=>{
        return new Promise(async(resolve,reject)=>{
            let user = await db.get().collection(collection.USER_COLLECTION).find({phone:phone}).toArray()
            console.log(user);
            resolve(user)
        })
    },
    addToCart:async (userId,proId)=>{
        let proObj={
            item:objectId(proId),
            quantity:1
        }
        let proq=await db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(proId)},{available_quantity:1,_id:0})
        console.log(proq);
        if(proq.available_quantity>=1){
            return new Promise(async(resolve,reject)=>{
            
                let userCart=await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
                if(userCart){
                    let proExist=userCart.products.findIndex(product=> product.item==proId)
                    console.log(proExist);
                    if(proExist!=-1){
                        db.get().collection(collection.CART_COLLECTION).updateOne({user:objectId(userId),'products.item':objectId(proId)},{
                            $inc:{'products.$.quantity':1}
                        }).then(()=>{
                            resolve()
                        })
                        
                    }else{
                    db.get().collection(collection.CART_COLLECTION).updateOne({user:objectId(userId)},
                    {
        
                            $push:{products:proObj}
    
                    }
                    ).then((response)=>{
                        resolve()
                    })
                }
                }
                else{
                    let cartObj={
                        user:objectId(userId),
                        products:[proObj]
                    }
                    db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response)=>{
                        resolve()
                    })
                }
            })
        }
        else{
            resolve()
        }
       
    },
    addToWish:(userId,proId)=>{
        let proObj={
            item:objectId(proId),
            quantity:1
        }
        return new Promise(async(resolve,reject)=>{
           let userCart=await db.get().collection(collection.WISH_COLLECTION).findOne({user:objectId(userId)})
            if(userCart){
                let proExist=userCart.products.findIndex(product=> product.item==proId)
                console.log(proExist);
                if(proExist!=-1){
                    
                    
                }else{
                db.get().collection(collection.WISH_COLLECTION).updateOne({user:objectId(userId)},
                {
    
                        $push:{products:proObj}

                }
                ).then((response)=>{
                    resolve()
                })
            }
            }
            else{
                let cartObj={
                    user:objectId(userId),
                    products:[proObj]
                }
                db.get().collection(collection.WISH_COLLECTION).insertOne(cartObj).then((response)=>{
                    resolve()
                })
            }
        })
    },
    getCartProducts:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let cartItems=await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match:{user:objectId(userId)}
                },
                {
                    $unwind:'$products'
                },
                {
                    $project:{
                        item:'$products.item',
                        quantity:'$products.quantity'
                    }
                },
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        localField:'item',
                        foreignField:'_id',
                        as:'product'
                    }
                },
                {
                    $project:{
                        item:1,quantity:1,product: {$arrayElemAt:['$product',0]}
                    }
                }
                
            ]).toArray()
           
            resolve(cartItems)
        })

    },
    getWishProducts:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let cartItems=await db.get().collection(collection.WISH_COLLECTION).aggregate([
                {
                    $match:{user:objectId(userId)}
                },
                {
                    $unwind:'$products'
                },
                {
                    $project:{
                        item:'$products.item',
                        quantity:'$products.quantity'
                    }
                },
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        localField:'item',
                        foreignField:'_id',
                        as:'product'
                    }
                },
                {
                    $project:{
                        item:1,quantity:1,product: {$arrayElemAt:['$product',0]}
                    }
                }
                
            ]).toArray()
           
            resolve(cartItems)
        })

    },
    getCartCount:(id)=>{
        return new Promise(async(resole,reject)=>{
            let cart=await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(id)})
            if(cart){
                count=cart.products.length
            }
            else{
                count=0
            }
            resole(count)
        })
    },
    getWishCount:(id)=>{
        return new Promise(async(resole,reject)=>{
            let cart=await db.get().collection(collection.WISH_COLLECTION).findOne({user:objectId(id)})
            if(cart){
                count=cart.products.length
            }
            else{
                count=0
            }
            resole(count)
        })
    },
    changeProductQuantity:(details)=>{
        details.count=parseInt(details.count)
        
        return new Promise((resolve,reject)=>{
   
                db.get().collection(collection.CART_COLLECTION).updateOne({_id:objectId(details.cart),'products.item':objectId(details.product)},{
                    $inc:{'products.$.quantity':details.count}
                }).then(()=>{
                    resolve({status:true})
                })
            
         
           
        })
    },
    getTotalAmount:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let total=await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match:{user:objectId(userId)}
                },
                {
                    $unwind:'$products'
                },
                {
                    $project:{
                        item:'$products.item',
                        quantity:'$products.quantity'
                    }
                },
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        localField:'item',
                        foreignField:'_id',
                        as:'product'
                    }
                },
                {
                    $project:{
                        item:1,quantity:1,product: {$arrayElemAt:['$product',0]}
                    }
                },
                {
                    $group:{
                        _id:null,
                        total:{$sum:{$multiply:['$quantity',{$toInt:{$cond:[{$gte:['$product.productoffer',1]},'$product.productoffer','$product.product_price']}}]}},
                    }
                }
                
            ]).toArray()
                console.log(total[0].total);
                resolve(total[0].total)
           
          
        })
    },
    getAmount:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let total=await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match:{user:objectId(userId)}
                },
                {
                    $unwind:'$products'
                },
                {
                    $project:{
                        item:'$products.item',
                        quantity:'$products.quantity'
                    }
                },
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        localField:'item',
                        foreignField:'_id',
                        as:'product'
                    }
                },
                {
                    $project:{
                        item:1,quantity:1,product: {$arrayElemAt:['$product',0]}
                    }
                },
                {
                    $group:{
                        _id:null,
                        total:{$sum:{$multiply:['$quantity',{$toInt:'$product.product_price'}]}}
                    }
                }
                
            ]).toArray()
      
                resolve(total[0].total)
           
          
        })
    },
    deleteCartPro:(userId,proId)=>{
        console.log();
       db.get().collection(collection.CART_COLLECTION).updateOne({user:objectId(userId)},{$pull:{products:{item:objectId(proId)}}}).then((a)=>{
        console.log(a);
        resolve(a)
    })
    .catch(()=>{
        resolve()
    })

    
    },
    deleteWishPro:(userId,proId)=>{
        console.log();
       db.get().collection(collection.WISH_COLLECTION).updateOne({user:objectId(userId)},{$pull:{products:{item:objectId(proId)}}}).then((a)=>{
        console.log(a);
        resolve(a)
    })
    .catch(()=>{
        resolve()
    })

    
    },
    orderPlace:(order,products,total)=>{
        return new Promise(async(resolve,reject)=>{
            console.log(order,products,total);
            console.log(order.plan);
            let orderd= await db.get().collection(collection.ADRRESS_COLLECTION).find({_id:objectId(order.plan)}).toArray()
            console.log(orderd[0]);
            let datez = new Date()
            day =datez.getDate()
            month =datez.getMonth()
            year = datez.getFullYear()
            date = `${day}-${month}-${year}`
            let status=order.payment==='cod'?'Placed':'pending'
            let orderObj={
                deliveryDetails:{
                    mobile:orderd[0].phone,
                    name:orderd[0].name,
                    street1:orderd[0].street1,
                    street2:orderd[0].street2,
                    town:orderd[0].town,
                    state:orderd[0].state,
                    pincode:orderd[0].pincode,
                    email:orderd[0].email
                     
                },
                userId:objectId(order.userId),
                paymentMethod:order.payment,
                products:products,
                totalAmount:total,
                status:status,
                date:date,
                sortdate:datez
            }
            db.get().collection(collection.ORDER_COLLECTION).insertOne(orderObj).then((response)=>{
                db.get().collection(collection.CART_COLLECTION).remove({user:objectId(order.userId)})
                console.log("orders:",response.insertedId);
                resolve(response.insertedId)
            })
        })
    },
    getcartprolist:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let cart=await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
            if(cart){
                resolve(cart.products)
            }
           else{
          
           }
        })
    },
    getorders:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let orders=await db.get().collection(collection.ORDER_COLLECTION).find({userId:objectId(userId)}).sort({sortdate:-1}).toArray()

            resolve(orders)
        })
    },
    detailsorders:(userId)=>{

        if(userId.length==24){
        return new Promise(async(resolve,reject)=>{
            let orders=await db.get().collection(collection.ORDER_COLLECTION).find({_id:objectId(userId)}).toArray()
            
            resolve(orders)
        })}
        else{
            resolve()
        }
    },
    getordersadmin:()=>{
        return new Promise(async(resolve,reject)=>{
            let orders=await db.get().collection(collection.ORDER_COLLECTION).find().sort({sortdate:-1}).toArray()
        
            console.log(orders);
            resolve(orders)
        })
    },
    getOrderProducts:(userId)=>{
          if(userId.length==24){
        return new Promise(async(resolve,reject)=>{
            let cartItems=await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                {
                    $match:{_id:objectId(userId)}
                },
                {
                    $unwind:'$products'
                },
                {
                    $project:{
                        item:'$products.item',
                        quantity:'$products.quantity'
                    }
                },
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        localField:'item',
                        foreignField:'_id',
                        as:'product'
                    }
                },
                {
                    $project:{
                        item:1,quantity:1,product: {$arrayElemAt:['$product',0]}
                    }
                }
                
            ]).toArray()
            resolve(cartItems)
        })
    }
    else{
        resolve()
    }
    },
    orderstatus: (id,status) => {
        return new Promise(async (resolve, reject) => {
            console.log(id)

            db.get().collection(collection.ORDER_COLLECTION).updateOne({ _id: objectId(id) }, { $set: { status: status } })
        })
    },
    generateRazorpay:(orderId,total)=>{
   
        return new Promise((resolve,reject)=>{


            var options=({
              amount: total*8200,
              currency: "INR",
              receipt: ""+orderId
            
            });
            instance.orders.create(options,function(err,order){
                if(err){
                    console.log(err);
                }else{
                    console.log("New Order :",order);
                    resolve(order)
                }
   
            })       
        })
    },
    verifyPayment:(details)=>{
        return new Promise((resolve,reject)=>{
            const crypto = require('crypto')
            let hmac = crypto.createHmac('sha256','Gld5NaLB5Pz0bzVSD1ZFf5Bb')

            hmac.update(details['payment[razorpay_order_id]']+'|'+details['payment[razorpay_payment_id]']);
            hmac=hmac.digest('hex')
            if(hmac==details['payment[razorpay_signature]']){
                resolve()
            }else{
                reject()
            }
        })
    },
    changePaymentStatus:(orderId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:objectId(orderId)},
            
            {
                $set:{
                    status:'Placed'
                }
            }).then(()=>{
                resolve()
            })
        })
    },
    coupen:(coupens,id)=>{
        return new Promise(async(resolve,reject)=>{
            apply=await db.get().collection(collection.COUPEN_COLLECTION).find({coupen:coupens,User:{$in:[id]}}).toArray()
            applys=await db.get().collection(collection.COUPEN_COLLECTION).find({coupen:coupens}).toArray()
            console.log(apply);
           console.log(id);

            if(apply[0]){ 
                console.log("inned");
                resolve("used")
         

            }
            else{
                console.log("Outted");
              
                hehe=await db.get().collection(collection.COUPEN_COLLECTION).updateOne({ coupen: coupens }, { $addToSet: { User: id} })
                console.log(hehe);
                resolve(applys)
            } 
        })
    },
    search:(searchop)=>{
        return new Promise(async(resolve,reject)=>{
            searchc= await db.get().collection(collection.PRODUCT_COLLECTION).find({product_name:{$regex:searchop,$options:'i'}}).toArray()
            console.log(searchc);
            resolve(searchc)
        })
    },
    dailysaless: () => {
        return new Promise(async (resolve, reject) => {
           let dailysales = await db
              .get()
              .collection(collection.ORDER_COLLECTION)
              .aggregate([
                 {
                    $unwind: "$products",
                 },
                 {
                    $match: {
                        
                       "status": {
                          $nin: ["Cancelled"],
                       },
                    },
                 },
                 {
                    $lookup: {
                       from: collection.PRODUCT_COLLECTION,
                       localField: "products.item",
                       foreignField: "_id",
                       as: "proDetails",
                    },
                 },
                 {
                    $project: {
                       date: 1,
                       prodDetails: { $arrayElemAt: ["$proDetails", 0] },
                       proQty: "$products.quantity",
                    },
                 },
                 {
                    $project: {
                       proQty: 1,
                       date: 1,
                       prodPrice: "$prodDetails.product_price",
                    },
                 },
                 {
                    $group: {
                       _id: "$date",
                       dailySales: { $sum: { $multiply: ["$proQty", {$toInt:"$prodPrice"}] } },
                       qty:{"$sum":"$proQty"},
                    },
                 },
                 {
                    $sort: {
                       _id: 1,
                    },
                 },
              ])
              .toArray();
    
           resolve(dailysales);
           console.log(dailysales);
        });
     },
     weeksaless: () => {
        return new Promise(async (resolve, reject) => {
           let monthlySales = await db
              .get()
              .collection(collection.ORDER_COLLECTION)
              .aggregate([
                 {
                    $unwind: "$products",
                 },
                 {
                    $match: {
                        
                       "status": {
                          $nin: ["Cancelled"],
                       },
                    },
                 },
                 {
                    $lookup: {
                       from: collection.PRODUCT_COLLECTION,
                       localField: "products.item",
                       foreignField: "_id",
                       as: "proDetails",
                    },
                 },
                 {
                    $project: {
                       date: 1,
                       prodDetails: { $arrayElemAt: ["$proDetails", 0] },
                       proQty: "$products.quantity",
                    },
                 },
                 {
                    $project: {
                       proQty: 1,
                       date: 1,
                       prodPrice: "$prodDetails.product_price",
                    },
                 },
                 {
                    $group: {
                       _id: "$date",
                       monthlySales: { $sum: { $multiply: ["$proQty", {$toInt:"$prodPrice"}] } },
                       qty:{"$sum":"$proQty"},
                    },
                 },
                 {
                    $sort: {
                       _id: 1,
                    },
                 },
                 {
                    $limit:31
                 }
              ])
              .toArray();
         console.log("sadsasa");
         let monthsum=0;
         monthlySales.forEach(sums)
         function sums(item){
        
           monthsum +=item.monthlySales
         }
         let monthorder=0;
         monthlySales.forEach(sumss)
         function sumss(item){
        
          monthorder +=item.qty
         }
         console.log(monthlySales);
         total={monthsum,monthorder,monthlySales}
           resolve(total);
           console.log(total);
        });
     },
     yearlysaless: () => {
        return new Promise(async (resolve, reject) => {
           let yearlySales = await db
              .get()
              .collection(collection.ORDER_COLLECTION)
              .aggregate([
                 {
                    $unwind: "$products",
                 },
                 {
                    $match: {
                        
                       "status": {
                          $nin: ["Cancelled"],
                       },
                    },
                 },
                 {
                    $lookup: {
                       from: collection.PRODUCT_COLLECTION,
                       localField: "products.item",
                       foreignField: "_id",
                       as: "proDetails",
                    },
                 },
                 {
                    $project: {
                       date: 1,
                       prodDetails: { $arrayElemAt: ["$proDetails", 0] },
                       proQty: "$products.quantity",
                    },
                 },
                 {
                    $project: {
                       proQty: 1,
                       date: 1,
                       prodPrice: "$prodDetails.product_price",
                    },
                 },
                 {
                    $group: {
                       _id: "$date",
                       yearlySales: { $sum: { $multiply: ["$proQty", {$toInt:"$prodPrice"}] } },
                       qty:{"$sum":"$proQty"},
                    },
                 },
                 {
                    $sort: {
                       _id: 1,
                    },
                 },
                 {
                    $limit:365
                 }
              ])
              .toArray();
         console.log("sadsasa");
         let monthsum=0;
         yearlySales.forEach(sums)
         function sums(item){
        
           monthsum +=item.yearlySales
         }
         let monthorder=0;
         yearlySales.forEach(sumss)
         function sumss(item){
        
          monthorder +=item.qty
         }
         total={monthsum,monthorder,yearlySales}
           resolve(total);
           console.log(total);
        });
     },
     todaysaless: () => {
        return new Promise(async (resolve, reject) => {
           let dailysales = await db
              .get()
              .collection(collection.ORDER_COLLECTION)
              .aggregate([
                 {
                    $unwind: "$products",
                 },
                 {
                    $match: {
                        
                       "status": {
                          $nin: ["Cancelled"],
                       },
                    },
                 },
                 {
                    $lookup: {
                       from: collection.PRODUCT_COLLECTION,
                       localField: "products.item",
                       foreignField: "_id",
                       as: "proDetails",
                    },
                 },
                 {
                    $project: {
                       date: 1,
                       prodDetails: { $arrayElemAt: ["$proDetails", 0] },
                       proQty: "$products.quantity",
                    },
                 },
                 {
                    $project: {
                       proQty: 1,
                       date: 1,
                       prodPrice: "$prodDetails.product_price",
                    },
                 },
                 {
                    $group: {
                       _id: "$date",
                       dailySales: { $sum: { $multiply: ["$proQty", {$toInt:"$prodPrice"}] } },
                       qty:{"$sum":"$proQty"},
                    },
                 },
                 {
                    $sort: {
                       _id: -1,
                    },
                 },
              ])
              .toArray();
    
           resolve(dailysales);
        });
     },
     saveadress:(adress)=>{
        console.log(adress);
            return new Promise(async(resolve,reject)=>{
                db.get().collection(collection.ADRRESS_COLLECTION).insertOne(adress).then((id)=>{
                    console.log(id);
               }).catch((err)=>{
                console.log(err);
               })
            })
     }
}