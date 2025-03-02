import app from "./app.js"
import {config} from "dotenv";
import "../src/api/v1/config/database.config.js";
import "../src/api/v1/config/initialSetup.js";

config();

console.log("Server on port", app.get("port"));
