const mongoose = require("mongoose");
require('dotenv').config();
const connection = async() => {
    const url = process.env.DB_URL
    try{
       await mongoose.connect(url)
       console.log("connected to database")
    }
    catch(e){
        console.log(e.message)
    }
} 

module.exports = connection