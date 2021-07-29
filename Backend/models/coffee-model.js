const { Schema } = require("mongoose");
const mongoose = require('../db/connections')

const CoffeeSchema = new Schema({

    name: {
        type: String,
        required : true
        
    },
    
    flavor: {
         type: String,
         required : true
    },
    roast:{
         type: String,
        required : true
    },
    region: { 
        type: String, 
        required : true
    },
    price: {
        type: [String], 
        required : true
    },
    weight: {
         type: [String], 
         required : true
        
    },
    img : { 
        data: Buffer, 
        contentType: String, 
     },
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},
{timestamps : true}
)

const Coffee = mongoose.model('Coffee', CoffeeSchema)
module.exports = Coffee;