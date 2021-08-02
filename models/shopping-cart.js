const { Schema } = require("mongoose");
const mongoose = require('../db/connections')

const ShoppingCartSchema = new Schema({
    
       
    email: {type: String},
    coffee_id: [{type: mongoose.Schema.Types.ObjectId, ref: 'Coffee'}]
},
{timestamps : true}
)

const ShoppingCart = mongoose.model('ShoppingCart', ShoppingCartSchema)
module.exports = ShoppingCart;
