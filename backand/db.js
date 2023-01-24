const mongoose= require("mongoose");
const mongUril="mongodb://localhost:27017/"
mongoose.set('strictQuery', false);

const connectToMongo= async()=>{
mongoose.connect(mongUril,()=>{
    console.log("connected to mongo succesfully")
})
}

module.exports =connectToMongo;