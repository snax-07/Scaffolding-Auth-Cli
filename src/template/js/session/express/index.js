import express from "express";
import session from "express-session";
import {RedisStore} from "connect-redis";
import csrf from 'csrf';
import Redis from "ioredis";
import cookieParser from "cookie-parser";
import cors from 'cors'
import authRoutes from './routes/authRoute.js'
import dotenv from 'dotenv'

dotenv.config();
const app = express();
export const redis = new Redis();
const csrfProtection = new csrf({
  cookie : false //Use session storage rather cookie session
}) 

app.use(express.json());
app.use(cors({
  origin : "http://localhost:8000",
  credentials : true,
}));
app.use(cookieParser());
app.use(
  session({
    name: "SID",
    store: new RedisStore({ client: redis }),
    secret: "super-secret",
    saveUninitialized: false,
    resave: false,
    cookie : {
      httpOnly : true,
      secure : process.env.NODE_ENV === 'production',
      sameSite : "strict",
      maxAge : 1000 * 60 * 60 * 24, //THIS WILL DEFINE THE AGE OF SESSION 
    }
  })
);

app.use("/auth" , authRoutes)

app.listen(8000  , () => {
    console.log("Server is running on 8000");
})