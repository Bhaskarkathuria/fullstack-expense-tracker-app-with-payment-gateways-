const Sequelize=require('sequelize');
const sequelize=require('../config/database');

const User=sequelize.define('userInfo',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    },
    isPremiumuser:{
        type:Sequelize.BOOLEAN,
        allowNull:false

    },
     totalexpense:{
        type:Sequelize.INTEGER,
        allowNull:false,
        defaultValue:0
    }
});

module.exports=User;