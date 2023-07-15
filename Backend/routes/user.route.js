
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../model/user.model");

router.post("/register", async(req,res) => {
     try {
        const {username, email, dob, role, location, password} = req.body;

        const newpassword = await bcrypt.hash(password, 10);

        const user = await UserModel.create({...req.body, password:newpassword})
        await user.save();
        return res.status(201).json({message: "user registered"})
     } catch (error) {
        res.status(500).json({message: "Internal server Error"})
     }
})

router.post("/login", async(req,res) => {

   try {
      const {username, password} = req.body;
      const user = await UserModel.findOne({username});

      if(!user){
         res.send("Login first!")
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if(!isPasswordValid){
         res.status(201).send("Incrorrect password")
      }

      const token = jwt.sign({userId: user._id, username: user.username}, "abdul")
      res.status(200).send({token})
      
   } catch (error) {
      res.status(401).send(error)
   }

})

module.exports = router;