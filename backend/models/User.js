const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new Schema({
    firstname:{
        type : String,
        required:true
    },
    lastname:{
        type : String,
        required:true
    },
    username:{
        type : String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    status: {
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now()
    },
})
const user = mongoose.model('user', UserSchema);
user.createIndexes();
module.exports = user;