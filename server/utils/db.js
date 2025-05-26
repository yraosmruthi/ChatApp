const mongoose = require('mongoose')


const connectDb=async ()=>{
    try{
      await mongoose.connect('mongodb+srv://smruthiyrao17:AMt0ypW4yozQLzAE@cluster0.dnvpdhl.mongodb.net/chatApp?retryWrites=true&w=majority&appName=Cluster0', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("connection successfull to mongodb")
    }catch(error){
        console.log(error)
        process.exit(1)
         
    }
}
module.exports = connectDb
