const mongoose = require('mongoose');

async function connectDB(){
    const uri = process.env.MONGO_URI;
    if(!uri){
        console.error("MONGO_URI US NOT SET");
        process.exit(1);
    }
    try{
        await mongoose.connect(uri);
    }catch(e){
        console.error("Mongo_DB connection failed",e.message);
        process.exit(1);
    }

}


module.exports = connectDB;




