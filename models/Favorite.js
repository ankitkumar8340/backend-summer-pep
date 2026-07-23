const mongoose = require('mongoose');
const favoriteSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required:true,
        index:true
    },
    placeId: {
        type:String,
        required:true
    },

    name:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    address:{
        type:String,
        default:""
    },
    lat:{
        type:String,
        required:true
    },
    lon:{
        type:String,
        required:true
    },

},
{timestamps:true}

)

favoriteSchema.index({user:1, placeId:1});
module.exports = mongoose.model("Favourite ", favoriteSchema);














