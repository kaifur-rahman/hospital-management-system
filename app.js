require('dotenv').config();
//dependices
const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const ejs=require('ejs');

//configuring app
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.set('views engine','ejs');


//get requests
app.get("/",function(req,res){
  res.sendFile(__dirname+"/index.html");
});
app.get("/login",function(req,res){
  res.render("login.ejs");
});
//listening
app.listen(3000,function(){
  console.log("Server started at port 3000.");
});
