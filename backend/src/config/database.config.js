import mongoose from "mongoose";

try{
    const db = await mongoose.connect(process.env.MONGODB_URI||"mongodb://localhost/smartcity");
    console.log("Database is connected to", db.connection.name);
}
catch(error){
    console.error(error.message);
}