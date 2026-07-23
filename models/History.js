const mongoose = require('mongoose');
const historySchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true, index:true
    },
    category:{
        type:String,
        required:true
    },

    lat:{
        type:Number,
        required:true
    },
    lon:{
        type:Number,
        required:true
    },

    locationLabel:{
        type:String, 
        default:""
    },
    resultCount:{
        type:Number, 
        default:0
    }
},
{timestamps:true}

);

module.exports = mongoose.model("History", historySchema);

