const { Schema } = require('mongoose')
const mongoose = require('../db/connections')


const OrdersSchema = new Schema({
    name : 

        [{type : String}],
    email : 

        {type: String}
    ,
    totalPrice : 

        {type : String}

},
    {timestamps : true}
)

const Orders = mongoose.model('Orders', OrdersSchema)
module.exports = Orders;