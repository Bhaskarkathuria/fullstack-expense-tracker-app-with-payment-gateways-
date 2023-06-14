const express=require('express');
const router=express.Router();
const Razorpay=require('razorpay');
const Order=require('../model/orders');
const userAuthentication=require('../midleware/auth')
require('dotenv').config();




router.post('/',userAuthentication.authenticate,(req,res,next)=>{
    try{
        console.log(req.body)
        const {payment_id,order_id}=req.body;
        Order.findOne({where:{orderId:order_id}})
        .then(order=>{
            order.update({paymentId:payment_id,status:"Successful"})
            .then(req.user.update({isPremiumuser:true})
            .then(()=>{ return res.json({success:true,message:"transaction successfull"})})
            .catch((err)=>{console.log(err)}))
            .catch((err)=>{console.log(err)})
        })
        .catch()
    }
    catch{}
})

module.exports=router;