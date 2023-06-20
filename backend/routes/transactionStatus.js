const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const Order = require('../model/orders');
const user=require('../model/user')
const userAuthentication = require('../midleware/auth');
const jwt=require('jsonwebtoken');
require('dotenv').config();




router.post('/', userAuthentication.authenticate, (req, res, next) => {
  try {
    console.log(req.body);
    const { payment_id, order_id } = req.body;
    Order.findOne({ where: { orderId: order_id } })
      .then(order => {
        if (payment_id) {
          order.update({ paymentId: payment_id, status: "Successful" })
            .then(() => {
              req.user.update({ isPremiumuser: true })
                .then(() => {
                   const secretKey='my_secret_key'
                   //const premiumUser='true'
                  const generateacesstoken=(premiumUser)=>{
                return jwt.sign({premiumUser},secretKey)
                }
                  return res.json({ success: true, message: "Transaction successful",token:generateacesstoken(true)});
                  
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          order.update({ status: "Failed" })
            .then(() => {
              return res.json({ success: false, message: "Transaction failed" });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch(err => {
        console.log(err);
      });
  } catch {
  }
});

module.exports = router;