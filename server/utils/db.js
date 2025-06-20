const mongoose = require('mongoose')
const URL = process.env.MONGO_URI

const connectDb=async ()=>{
    try{
      await mongoose.connect(URL);
      console.log("connection successfull to mongodb")
    }catch(error){
        console.log(error)
        process.exit(1)
   }
}
module.exports = connectDb
