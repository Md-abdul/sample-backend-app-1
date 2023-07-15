
const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/user.route");
const routers = require("./routes/post.route");
const cors = require("cors")
const app = express();

require("dotenv").config();
app.use(express.json());
app.use(cors())

const connect = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("connected")
    } catch (error) {
        console.log(error)
    }
}

app.get("/", (req,res) => {
    res.send("Welcome to home !")
})

app.use("/user", router)
app.use("/post", routers)
app.listen(2020, () => {
    connect();
    console.log("server running on 2020")
})