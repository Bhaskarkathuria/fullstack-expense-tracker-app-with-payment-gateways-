const Sequelize = require("sequelize");
const sequelize = require("./config/database");
const express = require("express");
const adminRoutes = require("./routes/admin");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const userRoutes = require("./routes/login");
const expenseRoutes = require("./routes/expense");
const premiumRoutes = require("./routes/premium");
const transactionStatusRoutes = require("./routes/transactionStatus");
const premiumfeaturesRoutes = require("./routes/premiumfeatures");
const forgotpasswordRoutes=require("./routes/forgotpassword")

const userinfo = require("./model/user");
const expense = require("./model/expensemodel");
const orders = require("./model/orders");

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res, next) => {
  res.send("Server listening on port 5000");
});

app.use("/signup", adminRoutes);
app.use("/login", userRoutes);
app.use("/expenses", expenseRoutes);
app.use("/purchasePremium", premiumRoutes);
app.use("/trasactionstatus", transactionStatusRoutes);
app.use("/premiumfeatures", premiumfeaturesRoutes);
app.use("/forgotpassword",forgotpasswordRoutes)

userinfo.hasMany(expense);
expense.belongsTo(userinfo);

userinfo.hasMany(orders);
orders.belongsTo(userinfo);

sequelize
  .sync()
  //  .sync({force: true})
  .then((res) => {
    // const hostname = "127.0.0.1";
    // const port = 5000;
    // app.listen(port, hostname, () => {
    //   console.log(`Server running at http://${hostname}:${port}/`);
    // });
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
