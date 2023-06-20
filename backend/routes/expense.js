const express = require("express");
const router = express.Router();
const User = require("../model/expensemodel");
const User2 = require("../model/user");
const sequelize = require("../config/database");
const userAuthentication = require("../midleware/auth");

// router.get("/", userAuthentication.authenticate,(req, res, next) => {
//   User
//     .findAll({where:{id: req.user.id}})
//     .then((result) => {
//       res.json(result);
//     })
//     .catch((err) => {
//       res.send("<h1>Page Not Found</h1>");
//     });
// });

router.post("/", userAuthentication.authenticate, (req, res, next) => {
  User.create({
    amount: req.body.amount,
    description: req.body.description,
    category: req.body.category,
    userInfoId: req.user.id,
  })
    .then((result) => {
      const totalexpense = Number(User2.totalexpense) + Number(result.amount);
      console.log(totalexpense);

      // User2.update(
      //   {
      //     totalexpense: totalexpense,
      //   },
      //   {
      //     where: { id : req.user.id },
      //   }
      //   )
      //   .then((result)=> {
      //     res.send(result) })
      //     .catch((err) => {
      //       console.log(err);
      //     })

      //   User.update(
      //   {
      //     userInfoId: req.user.id,
      //   },
      //   {
      //     where: { id: req.user.id },
      //   }
      // ).then(()=> {
      //    console.log(result)
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });

      res.json({
        amount: result.amount,
        description: result.description,
        category: result.category,
      });
    })
    .catch((error) => {
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

// router.get('/:id',(req,res,next)=>{
//     User.findAll()
//     .then(result=>{
//         res.json(result)
//     })
//     .catch(error=>{
//         console.log(error)
//     })
// })

router.delete("/:id", (req, res, next) => {
  const prodid = req.params.id;
  User.findByPk(prodid)
    .then((product) => {
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
