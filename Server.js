const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors());

/* ---------- Serve Frontend ---------- */
app.use(express.static(path.join(__dirname, "frontend")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

/* ---------- Multer Storage ---------- */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "/tmp/my-uploads");
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

/* ---------- MongoDB Connection ---------- */
let connectToMDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://gangasri2523:Gangasri@cluster0.6qht0xy.mongodb.net/Ajio?retryWrites=true&w=majority");
        console.log("Successfully connected to MongoDB");
    } catch (error) {
        console.log("Unable to connect to MongoDB");
    }
};

/* ---------- User Schema ---------- */
let userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

let userClass = new mongoose.model("App", userSchema);

/* ---------- Signup API ---------- */
app.post("/signup", upload.none(), async (req, res) => {

    let userArr = await userClass.find().and({ email: req.body.email });

    if (userArr.length > 0) {
        res.json({ status: "failure", msg: "user already exists" });
    } else {
        try {

            let userObj = new userClass({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
            });

            await userClass.insertMany([userObj]);

            res.json({ status: "success", msg: "successfully created account" });

        } catch (error) {
            res.json({ status: "fail", msg: "unable to create user" });
            console.log(error);
        }
    }
});

/* ---------- Login API ---------- */
app.post("/login", upload.none(), async (req, res) => {

    let fetchedData = await userClass.find().and({ email: req.body.email });

    if (fetchedData.length > 0) {

        if (fetchedData[0].password == req.body.password) {

            let dataToSend = {
                name: fetchedData[0].name,
                email: fetchedData[0].email,
            };

            res.json({ status: "success", msg: dataToSend });

        } else {
            res.json({ status: "failure", msg: "Invalid password" });
        }

    } else {
        res.json({ status: "failure", msg: "User does not exist" });
    }
});

/* ---------- Start Server ---------- */
app.listen(1435, () => {
    console.log("Server running on port 1435");
});

connectToMDB();
