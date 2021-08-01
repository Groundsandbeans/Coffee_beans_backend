const { Schema } = require("mongoose");
const mongoose = require('../db/connections')

const ShoppingCartSchema = new Schema({
    
       
    email: {type: String, required : true }
    ,
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coffee'
    }
},

{timestamps : true}
)

const Users = mongoose.model('ShoppingCart', ShoppingCartSchema)
module.exports = ShoppingCart;
