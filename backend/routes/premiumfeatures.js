const express=require('express');
const router=express.Router();
const sequelize=require('../config/database');
const User=require('../model/user');
const expense=require('../model/expensemodel');
const userAuthentication=require('../midleware/auth');
const jwt=require('jsonwebtoken');


const getleaderboard=async(req,res,next)=>{
    try{
        const leaderboardofusers=await User.findAll({
            order:[['totalexpense','DESC']]

        })
        res.json(leaderboardofusers)

    }
    catch(err){
        console.log(err)
        res.json(err)

    }
}
router.get('/', userAuthentication.authenticate, getleaderboard);


module.exports=router;