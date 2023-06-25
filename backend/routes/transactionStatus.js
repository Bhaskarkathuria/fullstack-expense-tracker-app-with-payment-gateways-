const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const Order = require("../model/orders");
const user = require("../model/user");
const userAuthentication = require("../midleware/auth");
const jwt = require("jsonwebtoken");
require("dotenv").config();

function generateacesstoken(premiumUser, userId) {
  const secretKey = "my_secret_key";
  return jwt.sign({ premiumUser, userId }, secretKey);
}


router.post("/", userAuthentication.authenticate, (req, res, next) => {
  try {
    console.log(req.body);
    const { payment_id, order_id } = req.body;
    Order.findOne({ where: { orderId: order_id } })
      .then((order) => {
        if (payment_id) {
          order
            .update({ paymentId: payment_id, status: "Successful" })
            .then(() => {
              req.user
                .update({ isPremiumuser: true })
                .then(() => {
                  const secretKey = "my_secret_key";
                  const userId = req.user.id;
                  console.log("########======>>>>>>>>",userId)
                  const premiumUser = true;
                  const token = generateacesstoken(premiumUser, userId);
                  //const premiumUser='true'
                  // const generateacesstoken = (premiumUser) => {
                  //   return jwt.sign({ premiumUser }, secretKey);
                  // };
                  return res.json({
                    success: true,
                    message: "Transaction successful",
                    token,
                  });
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          order
            .update({ status: "Failed" })
            .then(() => {
              return res.json({
                success: false,
                message: "Transaction failed",
              });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } catch {}
});




module.exports = router;
