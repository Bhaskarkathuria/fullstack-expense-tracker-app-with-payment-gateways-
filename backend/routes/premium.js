const express=require('express');
const router=express.Router();

const Razorpay=require('razorpay');
const Order=require('../model/orders');
const userAuthentication=require('../midleware/auth')
require('dotenv').config();



router.get('/',userAuthentication.authenticate,(req,res,next)=>{
    try{
        const rzp=new Razorpay({
            key_id : process.env.RAZORPAY_key_id,
            key_secret : process.env.RAZORPAY_key_secret
        })
        const amount=100
        rzp.orders.create({amount,currency:"INR"},(err,order)=>{
            if(err){throw new Error(JSON.stringify(err))}
            
                req.user.createOrder({paymentId:"Pending",orderId:order.id , status:"PENDING"})
                .then(()=>{
                    return res.status(200).json({order,key_id : rzp.key_id})
                })
                .catch(err=>{
                    console.log(err)
                })
            
        })

    }catch(err){
        console.log(err)
        res.status(400).json({message:"Something Went Wrong",error:err})
    }
})

module.exports=router;