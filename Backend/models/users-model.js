const { Schema } = require("mongoose");
const mongoose = require('../db/connections')

const UserSchema = new Schema({
    
    userData :{
       firstName: {type: String , required : true },
       lastName: {type: String , required : true },
       email: [{type: String, required : true }],
       phone: [{type: String , required : true }],
    },
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Orders'
    }
},
{timestamps : true}
)

const Users = mongoose.model('Users', UserSchema)
module.exports = Users;
