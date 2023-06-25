const express = require("express");
const router = express.Router();
const Sib = require("sib-api-v3-sdk");
require("dotenv").config();

router.post("/", (req, res, next) => {
  console.log(req.body.registeredEmail);
  console.log(process.env.SIB_API_KEY);

  const client = Sib.ApiClient.instance;
  const apiKey = client.authentications["api-key"];
  apiKey.apiKey = process.env.SIB_API_KEY;

  const tranEmailApi = new Sib.TransactionalEmailsApi();

  const sender = {
    email: "kathuriabhaskar712@gmail.com",
    name:"Bhaskar Kathuria"
  };
  const receivers = [{ email: req.body.registeredEmail }];

  tranEmailApi
    .sendTransacEmail({
      sender,
      to: receivers,
      subject: "Password reset link",
      textContent: `Click on the link to reset your password`,
    })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
