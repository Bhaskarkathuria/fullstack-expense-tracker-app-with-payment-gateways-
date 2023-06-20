const jwt=require('jsonwebtoken');
const User=require('../model/user');

const authenticate = (req,res,next)=>{
    try{
        const token=req.header('Authorization');
        console.log(token)
        const user=jwt.verify(token,'my_secret_key');
        console.log(user)
        console.log('userid=======>>',user.userId)
        User.findByPk(user.userId).then(user=>{
            req.user=user,
            console.log(req.user)
            next();
        })
        .catch(err=>{
            console.log(err) 
        })
    }catch(err){
        console.log(err);
        return res.status(400).json({sucess:false})
    }
}

module.exports = {
  authenticate: authenticate
};

