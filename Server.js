const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors());

/* ---------- FRONTEND ---------- */
app.use(express.static(path.join(__dirname,"frontend")));

app.get("/",(req,res)=>{
res.sendFile(path.join(__dirname,"frontend","index.html"));
});

/* ---------- MULTER ---------- */
const storage = multer.diskStorage({
destination:(req,file,cb)=>{
cb(null,"/tmp")
},
filename:(req,file,cb)=>{
cb(null,Date.now()+"_"+file.originalname)
}
});

const upload = multer({storage:storage});

/* ---------- MONGODB ---------- */
mongoose.connect("mongodb+srv://gangasri2523:Gangasri@cluster0.6qht0xy.mongodb.net/Ajio")
.then(()=>console.log("MongoDB connected"))
.catch(()=>console.log("MongoDB error"));

/* ---------- USER MODEL ---------- */
const userSchema = new mongoose.Schema({
name:String,
email:String,
password:String
});

const User = mongoose.model("App",userSchema);

/* ---------- SIGNUP ---------- */
app.post("/signup",upload.none(),async(req,res)=>{

let user = await User.findOne({email:req.body.email});

if(user){
res.json({status:"failure",msg:"User already exists"});
}else{

let newUser = new User(req.body);
await newUser.save();

res.json({status:"success",msg:"Account created"});
}

});

/* ---------- LOGIN ---------- */
app.post("/login",upload.none(),async(req,res)=>{

let user = await User.findOne({email:req.body.email});

if(!user){
res.json({status:"failure",msg:"User not found"});
}
else if(user.password!==req.body.password){
res.json({status:"failure",msg:"Invalid password"});
}
else{
res.json({status:"success",msg:{name:user.name,email:user.email}});
}

});

/* ---------- SERVER ---------- */
app.listen(1435,()=>{
console.log("Server running on port 1435");
});
