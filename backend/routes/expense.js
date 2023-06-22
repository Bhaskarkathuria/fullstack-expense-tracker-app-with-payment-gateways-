const express = require("express");
const router = express.Router();
const User = require("../model/expensemodel");
const User2 = require("../model/user");
const sequelize = require("../config/database");

const userAuthentication = require("../midleware/auth");



router.post("/", userAuthentication.authenticate, async(req, res, next) => {
  const t= await sequelize.transaction();

  User.create({
    amount: req.body.amount,
    description: req.body.description,
    category: req.body.category,
    userInfoId: req.user.id,
    transaction:t
  })
    .then((result) => {;
     
      const totalexpense =
      parseInt(User2.rawAttributes.totalexpense.defaultValue) +
      parseInt(result.dataValues.amount);
      console.log(totalexpense);
      User2.rawAttributes.totalexpense.defaultValue = totalexpense;

      User2.update(
        {
          totalexpense: totalexpense,
        },
        {
          where: { id : req.user.id },
          transaction:t
        }
        )
        .then(async(result)=> {
        //console.log(result)
        await t.commit();
        res.json({
          amount: result.amount,
          description: result.description,
          category: result.category,
        });
        
        
        })
          .catch(async (err) => {
            await t.rollback();
            console.log(err);
          })
      
    })
    .catch(async(error) => {
      await t.rollback()
      console.log(error);
    });
});

router.get("/", userAuthentication.authenticate, (req, res, next) => {
  console.log(req.user);
  User.findAll({ where: { userInfoId: req.user.id } })
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((error) => {
      console.log(error);
    });
});


router.delete("/:id", (req, res, next) => {

  const prodid = req.params.id;
  User.findByPk(prodid)
    .then((product) => {
     // console.log("PRODUCT====>>>>>", product);
      //console.log("DELETED AMOUNT======>>>>>",product.amount)
       
      User2.update({
        totalexpense:totalexpense-product.amount
      })
      return product
        .destroy()
        .then((result) => {
          console.log("Product destroyed");
          res.send(result);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch();
});

module.exports = router;
