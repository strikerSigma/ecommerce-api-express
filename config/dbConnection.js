const mongoose = require("mongoose");
require("dotenv").config(); 
const dbConnection = async()=>{
    try{
        mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
    } catch (e) {
        console.log(e);
    }
}
module.exports =  dbConnection;