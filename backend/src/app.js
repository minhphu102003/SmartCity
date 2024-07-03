import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';


import v1Routes from "./api/v1/index.js";

const app = express();


app.set("port", process.env.PORT||8000);
app.set("json space",4);

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

// routes
// Use the routes from v1
app.use("/v1", v1Routes);

export default app;


