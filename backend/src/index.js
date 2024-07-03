import app from "./app.js"
import {config} from "dotenv";
import "./config/database.config.js";
import "./config/initialSetup.js";

config();

app.listen(process.env.PORT||8000);
console.log("Server on port", app.get("port"));
