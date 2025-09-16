import Sequelize from "sequelize";

const sequelize=new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || "mysql",
    logging: true,
  }
);

const connectDB=async()=>{
    try{
        await sequelize.authenticate();
        console.log("Database connected successfully");
    }catch(error){
        console.log("Database connection failed:",error.message);
        process.exit(1);
    }
};

export {connectDB} ;
export default sequelize;