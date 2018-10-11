/*
  后台管理入口文件
*/
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const router = require("./router.js");
const app = express();

app.use("/www",express.static("public"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(router);

app.listen(3000,()=> {
  console.log("app is running......");
});