const  express = require("express");
const  mongoose = require("mongoose");
const  cors = require("cors");
const multer = require('multer');


const app = express();
app.use(cors());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {

      cb(null, '/tmp/my-uploads')
    },
    filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, `${Date.now()}_${file.originalname}`)
    }
  })
  
  const upload = multer({ storage: storage })


let connectToMDB = async()=>{
    try {
        await mongoose.connect("mongodb+srv://gangasri2523:Gangasri@cluster0.6qht0xy.mongodb.net/Ajio?retryWrites=true&w=majority");
        console.log("sucessfully connected to MDB");   
    } catch (error) {
        console.log("unable to connect to MDB");   
    }

  
}

let userSchema = new mongoose.Schema({

    name:String,
    email:String,
    password:String,

});
let userClass = new mongoose.model("App",userSchema);

app.post("/signup",upload.none(),async(req,res)=>{

    let userArr = await userClass.find().and({email:req.body.email});
       if(userArr.length>0){
        res.json({status:"failure",msg:"user already exists"});

       }else{
        try { 

            let userObj = new userClass({
    
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
        })
    
            await userClass.insertMany([userObj]);
    
            res.json({status:'success',msg:'succesfully created an account'});
            
        } catch (error) {
            res.json({status:'fail',msg:'unable to  created'});
            console.log(error)
        }

       }

    
// console.log(req.body);
});




app.post("/login",upload.none(),async(req,res)=>{
//  console.log(req.body);
 let fetchedData = await userClass.find().and({email:req.body.email});
  if(fetchedData.length>0){
    if(fetchedData[0].password == req.body.password){
        let dataToSend = {
            name:fetchedData[0].name,
            email:fetchedData[0].email,
      
        }
        res.json({status:"success",msg:dataToSend});   
    }else{
        res.json({status:"failure",msg:"Invalid password"});
    }

  }else{
    res.json({status:"failure",msg:"user does not existx"});
  }
});


app.listen(1435,()=>{
    console.log("server is running")
});


connectToMDB();