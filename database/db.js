const mongoose=require("mongoose");

const Connection=async()=>{
    const url=process.env.MONGO_URL;
    try{
        await mongoose.connect(url);
        console.log("database connected successfully");
    }catch(error){
        console.log('database connection error',error.message);
    }   
}
module.exports=Connection;