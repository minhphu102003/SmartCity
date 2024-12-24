import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env

// try{
//     const db = await mongoose.connect(process.env.MONGODB_URI||"mongodb://localhost/smartcity");
//     console.log("Database is connected to", db.connection.name);
// }
// catch(error){
//     console.error(error.message);
// }

try {
    const db = await mongoose.connect(process.env.MONGODB_URIONLINE, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("Database is connected to", db.connection.name);
} catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
}