const { Schema } = require('mongoose')
const mongoose = require('../db/connections')


const OrdersSchema = new Schema({

    orderHistory : [{type : String}],
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users' 
    }
},
    {timestamps : true}
)

const Orders = mongoose.model('Orders', OrdersSchema)
module.exports = Orders;