const Sequelize=require('sequelize');
const sequelize=require('../config/database')

const User=sequelize.define('orders',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    paymentId:{
        type:Sequelize.STRING,
        

    },
    orderId:{
        type:Sequelize.STRING,
        allowNull:false,
       

    },
    status:{
        type:Sequelize.STRING,
        allowNull:false,
        primaryKey:false

    }
})

module.exports=User;