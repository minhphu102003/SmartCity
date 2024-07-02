import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

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


export default app;


