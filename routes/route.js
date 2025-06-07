const express = require("express");
const router = express.Router();
const user = require("../model/model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const secret_key = "fjhdhjkfjkdhjkhkjgjkfhjkjkhkgjkdhgjkfhgkdhgdhhgjdhjkhdjkhjkg"
router.post("/register", async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    res.status(422).json({ message: "Please fill all the details" });
    return;
  }
  try {
    const email_find = await user.findOne({ email });
    if (!email_find) {
      const hashed_pass = await bcrypt.hash(password, 12);
      const data = await new user({
        name,
        email,
        phone,
        password: hashed_pass,
      });
      await data.save();
      res
        .status(201)
        .json({ message: "user registered succesfully", status: 201 });
    } else {
      res.status(422).json({ message: "User already exists" });
      return;
    }
  } catch (e) {
    res.status(422).json({ message: e.message });
    return;
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(422).json({ message: "Please fill all the details" });
    return;
  }
  try {
    const email_find = await user.findOne({ email });
    if (email_find) {
      const has_pass = await bcrypt.compare(password, email_find.password);
      if (has_pass) {
        const token = await jwt.sign({_id:email_find._id},secret_key)
        res
          .status(201)
          .json({ message: "user Login succesfully", status: 201,token:token });
      } else {
        res.status(422).json({ message: "Invalid crediantials" });
        return;
      }
    }
  } catch (e) {
    res.status(422).json({ message: "Invalid crediantials" });
    return;
  }
});

router.get("/profile",async(req,res)=>{
  const token = req.headers["authorization"];
  if(!token){
    return res.status(401).json({message:"No Token"})
  }
  else{
    try{
    const decode = await jwt.verify(token,secret_key);
    const db_user = await user.findById(decode._id)
    res.status(201).json({message:db_user})
    }
    catch(e){
      return res.status(401).json({message:"Invalid Token"})
    }
  }
})

module.exports = router;
