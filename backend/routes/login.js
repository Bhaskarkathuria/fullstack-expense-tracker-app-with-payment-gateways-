const express=require('express');
const router=express.Router();
const sequelize=require('../config/database');
const user=require('../model/user');
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')


router.post('/',(req,res,next)=>{
    // console.log(req.body);
    const password=req.body.password;
    const email=req.body.email;
    
    user.findOne({where:{email}})
    .then( (existingUser)=>{
        console.log(existingUser)
        if(existingUser){
            
          console.log(existingUser.password)
          const id = existingUser.id
          const secretKey='my_secret_key'
             function generateacesstoken(id){
                return jwt.sign({userId:id},secretKey)
                }

            bcrypt.compare(password,existingUser.password,(err,result)=>{
                
                if(err){ return res.status(400).json("Something went wrong")}
                if(result)
                {return res.status(200).json({messge:"Logged in successfully",token:generateacesstoken(existingUser.id)})}

             
            })
            
        }
        else{
            return res.status(400).json({success:false,message:"User does not exist"})
            
        }
    }
    )
    .catch(err=>{
        const errormessage='server error'
         res.status(400).send(errormessage)
    })
})

module.exports=router;