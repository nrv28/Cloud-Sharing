const mongoose = require('mongoose');


const configdb = () =>{
   try {
       mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.4kh4y.mongodb.net/File-Sharing`);
       console.log("MongoDB Connected");
   } catch (error) {
       console.log(error);
   }
};


module.exports = configdb;