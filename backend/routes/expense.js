const express=require('express');
const router=express.Router();
const User=require('../model/expensemodel');
const User2=require('../model/user')
const sequelize = require('../config/database');
const userAuthentication=require('../midleware/auth')


router.post('/',(req,res,next)=>{
    User.create({
        amount:req.body.amount,
        description:req.body.description,
        category:req.body.category
    })
    .then(result=>{
        res.json("Expenses added to database")
    })
    .catch(error=>{
        console.log(error)
    })
})

router.get('/',userAuthentication.authenticate,(req,res,next)=>{
    User2.findAll({where:{id:req.user.id}})
    .then(result=>{
        res.json(result)
    })
    .catch(error=>{
        console.log(error)
    })
})

router.get('/:id',(req,res,next)=>{
    User.findAll()
    .then(result=>{
        res.json(result)
    })
    .catch(error=>{
        console.log(error)
    })
})

router.delete('/:id',(req,res,next)=>{
    const prodid=req.params.id;
    User.findByPk(prodid)
    .then(product=>{
       return product.destroy()
       .then(res=>{
        console.log('Product destroyed')
        
       })
       .catch(err=>{
        console.log(err)
       })
    })
    .catch()
})


module.exports=router;

