const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://mxn62300:mnagulav@cluster0.j6mlfzi.mongodb.net/ucmblogger";
const connectToMongo = () =>{
    mongoose.set("strictQuery", false);
    mongoose.connect(mongoURI, ()=>{
        console.log("Connected to Mongo DB Successfully");
    })
}

module.exports = connectToMongo;
