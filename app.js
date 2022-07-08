require('dotenv').config();
//dependices
const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const ejs=require('ejs');
const mongoose=require('mongoose');
//connecting database with local port
mongoose.connect("mongodb://localhost:27017/hospital-management-system");

//initializing unique id
var unique_int_d=100;
var unique_str_d='d';
var unique_int_p=100;
var unique_str_p='p';
//////////to identify unique id
var unique_id_d=unique_int_d+unique_str_d;
var unique_id_p=unique_int_p+unique_str_p;
//to identify last type of user
var current='d';
//-----
//configuring app
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.set('views engine','ejs');

//database schema

//doctor detail schema
const doctorSchema=new mongoose.Schema({
  unique_id:String,
  fName:String,
  lName:String,
  degree:String,
  special:String,
  experience:Number,
  fee:Number,
  email:String,
  mob:Number,
  mSlot:String,
  eSlot:String,
  emailOtp:Number,
  mobOtp:Number,
  userName:String,
  pass:String
});
//patien detail Schema
const patientSchema=new mongoose.Schema({
  unique_id:String,
  fName:String,
  lName:String,
  dob:String,
  age:Number,
  sex:String,
  email:String,
  mob:Number,
  emailOtp:Number,
  mobOtp:Number,
  userName:String,
  pass:String
});
//admin details Schema
const adminSchema=new mongoose.Schema({
  fName:String,
  lName:String,
  email:String,
  mob:Number,
  emailOtp:Number,
  mobOtp:Number,
  userName:String,
  pass:String
});
//database collections
//doctor collection
const doctor=mongoose.model("doctor",doctorSchema);

//patient collections
const patient=mongoose.model("patient",patientSchema);

//admin collections
const admin=mongoose.model("admin",adminSchema);
//get requests

//home route
app.get("/",function(req,res){
  res.sendFile(__dirname+"/index.html");
});
app.get("/index.html",function(req,res){
  res.sendFile(__dirname+"/index.html");
});
//login page
app.get("/login",function(req,res){
  res.render("login.ejs");
});
//sign up home
app.get("/signup-home",function(req,res){
  res.render("signup-home.ejs");
});
//forgot Password
app.get("/forgotpassword",function(req,res){
  res.send("password reset page");
});
// /get request

//post routes

//login credentials
app.post("/loginauth",function(req,res){
  var username=req.body.userName;
  var pass=req.body.userPass;
  //for dashboard
  var doctorCount=0;
  var patientCount=0;
  //first finding username in doctor's collection
  doctor.findOne({userName:username},function(err,result){
    if(err){
      console.log("Error in finding user "+err);
    }else{
      //null means no such username found
      if(result==null){
        //therfore now checking in patient's collection
        patient.findOne({userName:username},function(err,result){
          if(err){
            console.log("Error in finding user in patient collection "+err);
          }else{
            //if here also null then we have to check admin collection.
            if(result==null){
              admin.findOne({userName:username},function(err,result){
                if(err){
                  console.log("Error in finding user in admin collection "+err);
                }else{
                  if(result==null){
                    res.send("User does'nt exist ");
                  }else{//admin found
                    if(pass===result.pass){
                      //counting total no. of doctors registered
                      doctor.count({},function(err,count){
                        if(err){
                          console.log("Error in counting total no. of doctors "+err);
                        }else{
                          //count
                          doctorCount=count;

                          //counting total no. of patients Registered
                          patient.count({},function(err,countp){
                            if(err){
                              console.log("Error in counting total no. of patients "+err);
                            }else{
                              //count
                              patientCount=countp;
                              //rendering
                              res.render("admin-login-portal.ejs",{fullName:result.fName+" "+result.lName,username:result.userName,firstname:result.fName,fname:result.fName,lname:result.lName,email:result.email,mob:result.mob,doctors:doctorCount,patients:patientCount,transactions:'#'});
                            }
                          });
                        }
                      });
                    }else{
                      res.send("wrong password");
                    }
                  }
                }
              });
            }else{
              //render patient's dashboard
              if(pass===result.pass){
                res.render("patient-login-portal.ejs",{fullName:result.fName+" "+result.lName,username:result.userName,firstname:result.fName,fname:result.fName,lname:result.lName,dob:result.dob,age:result.age,sex:result.sex,email:result.email,mob:result.mob});
              }else{
                res.send("Wrong password");
              }
            }
          }
        });
      }else{
        //render doctor's dashboard
        if(pass===result.pass){
          res.render("doctor-login-portal.ejs",{fullName:result.fName+" "+result.lName,username:result.userName,firstname:result.fName,fname:result.fName,lname:result.lName,degree:result.degree,special:result.special,exp:result.experience,fee:result.fee,email:result.email,mob:result.mob,mslot:result.mSlot,eslot:result.eSlot});
        }else{
          res.send("Wrong password");
        }
      }
    }
  });
});

//signup process

//signup-home-type-of-user
app.post("/signup-home",function(req,res){
  const typeOfUser=req.body.button;
  //doctor signup page
  if (typeOfUser==="userDoctor"){
    res.render("doctor-signup-form-step1.ejs");
  }
  //patient signup page
  else if (typeOfUser==="userPatient"){
    res.render("patient-signup-form-step1.ejs");
  };
});

//signup
//signup step 1 data
app.post("/otp-verification-form.html",function(req,res){
  res.render("otp-verification-form.ejs");
  //calculating keys to identify type of user
  const keys=Object.keys(req.body).length;

  //pusing doctor's data to database
  if(keys==11){
    const Doctor=new doctor({
      unique_id:unique_id_d,
      fName:req.body.firstName,
      lName:req.body.lastName,
      degree:req.body.degree,
      special:req.body.Speciality,
      experience:req.body.Experience,
      fee:req.body.fees,
      email:req.body.email,
      mob:req.body.mobile,
      mSlot:req.body.morningSlot,
      eSlot:req.body.eveningSlot,
      emailOtp:null,
      mobOtp:null,
      userName:null,
      pass:null
    });
    Doctor.save();
    unique_int_d=unique_int_d+1;
    unique_id_d=unique_int_d+unique_str_d;
    current='d';
  }

  //pushing patient's data to database
  else if(keys==8){
    const Patient=new patient({
      unique_id:unique_id_p,
      fName:req.body.firstName,
      lName:req.body.lastName,
      dob:req.body.dob,
      age:req.body.age,
      sex:req.body.sex,
      email:req.body.email,
      mob:req.body.mob,
      emailOtp:null,
      mobOtp:null,
      userName:null,
      pass:null
  });
  Patient.save();
  unique_int_p=unique_int_p+1;
  unique_id_p=unique_int_p+unique_str_p;
  current='p';

  }
  else{
    console.log("error in counting form input fields.")
  }
  //console.log(req.body);
});
//signup step 2 data fetching firstname and generating username.
app.post("/username-pass-form.html",function(req,res){
  //reading latest entry of data from database to generate its userName
  //current variable to identify last type of user
  if(current=='d'){
    //reading data from database to gereate its username
    //-1 since it was updated after appending new data
    doctor.find({unique_id:((unique_int_d-1)+unique_str_d)},function(err,data){
      if(err){
        console.log("error in findind data in doctor's collection "+err);
      }else{
        //collecting first name from database
        var fN=data[0].fName;
        //since it was increment after adding new doctor detail
        fN=fN+(unique_int_d-1)+unique_str_d;
        //rendering its username to client side
        res.render("username-pass-form.ejs",{username:fN});
        //adding username to database for that user -1 since it was incremented 2 times
        doctor.updateOne({unique_id:(unique_int_d-1)+unique_str_d},{userName:fN},function(err){
          //checking username added to database succesfully or not
          if(err){
            console.log("Error in updating username: "+err);
          }else{
          }
          current='d';
        });
      }
    });
  }
  else if(current=='p'){
    //reading data from database to gereate its username
    //-1 since it was updated after appending new data
    patient.find({unique_id:((unique_int_p-1)+unique_str_p)},function(err,data){
      if(err){
        console.log("error in findind data in patient's collection "+err);
      }else{
        //collecting first name from database
        var fN=data[0].fName;
        //since it was increment after adding new doctor detail
        fN=fN+(unique_int_p-1)+unique_str_p;
        //rendering its username to client side
        res.render("username-pass-form.ejs",{username:fN});
        //adding username to database for that user -1 since it was incremented 2 times
        patient.updateOne({unique_id:(unique_int_p-1)+unique_str_p},{userName:fN},function(err){
          //checking username added to database succesfully or not
          if(err){
            console.log("Error in updating username: "+err);
          }else{
          }
          current='p';
        });
      }
    });
  }
  else{
    console.log("Error in deciding type of user's otp was recorded.");
  }
});
//signup step 3 data addind passowrd of user to database
app.post("/signup-form-complete.html",function(req,res){
  if(current=='d'){
    var pass=req.body.password;
    var confirm_pass=req.body.confirm_password;
    doctor.updateOne({unique_id:(unique_int_d-1)+unique_str_d},{pass:pass},function(err){
      if(err){
        console.log("can't find data to update its password in doctor's collection");
      }else{
        res.render("signup-form-complete.ejs");
      }
    });

  }else if(current=='p'){
    var pass=req.body.password;
    var confirm_pass=req.body.confirm_password;
    patient.updateOne({unique_id:(unique_int_p-1)+unique_str_p},{pass:pass},function(err){
      if(err){
        console.log("can't find data to update its password in patient's collection");
      }else{
        res.render("signup-form-complete.ejs");
      }
    });

  }else{
    console.log("Error in deciding type of user's password generated.");
  }
})
// /signup

// /post requests
let port=process.env.PORT;
if(port==null || port==""){
  port=3000;
}
//listening
app.listen(port,function(){
  console.log("Server started succesfull");
});
