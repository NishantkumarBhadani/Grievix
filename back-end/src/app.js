import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app=express();

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
// app.use(cors({
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true
// }));


//middlewares
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public")) 

//configuring-parser
app.use(cookieParser())

//user
import userRouter from './routes/user.routes.js'
app.use("/api/v1/users",userRouter);

//complaint
import complaintRouter from './routes/complaint.routes.js'
app.use("/api/v1/complaint",complaintRouter);

//adminUpdatesForComplaints
import adminComplaintRouter from './routes/adminComplaintUpdates.routes.js'
app.use("/api/v1/complaint",adminComplaintRouter);

import userComplaintRouter from './routes/userComplaintDetails.routes.js'
app.use("/api/v1/complaint",userComplaintRouter);

import escalationRouter from './routes/escalation.routes.js'
app.use("/api/v1/complaint",escalationRouter);
export {app}