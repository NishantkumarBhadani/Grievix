import dotenv from 'dotenv';
import { app } from './app.js';
import sequelize, {connectDB} from './db/index.js';

dotenv.config({
    path:'./.env'
});

// console.log("JWT Secret at startup: ",process.env.JWT_ACCESS_SECRET)

connectDB()
.then(async ()=>{
    await sequelize.sync(); 
    app.listen(process.env.PORT || 3000, ()=>{
        console.log(`Server is running at port :${process.env.PORT}`);
        
    })
})
.catch((err)=>{
    console.log("DB connection failed");
    
})