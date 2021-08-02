const { Schema } = require("mongoose");
const mongoose = require('../db/connections')

const CoffeeSchema = new Schema({
    _id: Schema.Types.ObjectId,

    name: {
        type: String,
        required : true
    },
    flavor: {
        type : { type: String, required : true},
         
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
        type: String, 
        required : true
   },
   shoppingCart: [{ type: Schema.Types.ObjectId, ref: 'ShoppingCart' }]
},
{timestamps : true}
)

const Coffee = mongoose.model('Coffee', CoffeeSchema)
module.exports = Coffee;