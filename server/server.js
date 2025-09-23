import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from './config/mongodb.js'
import authRouter from './routes/authRoutes.js'
import userRouter from './routes/userRoutes.js'


const app=express();
const PORT=process.env.PORT || 3000;
connectDB();

app.use(express.json());
app.use(cookieParser());

app.use(cors({credentials:true}));
//accept requests from other sites and allow them to send cookies or login info

//API endpoints
app.get('/', (req,res)=>{
    res.sendStatus(200)
})

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)

app.listen(PORT, ()=>{
    console.log(`Server started on PORT ${PORT}`)
});