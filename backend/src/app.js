import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morganMiddleware from './config/morgan.config.js';

import v1Routes from "./api/v1/index.js";

const app = express();


app.set("port", process.env.PORT||8000);
app.set("json space",4);

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(morganMiddleware);

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

// routes
// Use the routes from v1
app.use("/api/v1", v1Routes);

export default app;


