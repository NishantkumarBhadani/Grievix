// import Sequelize from "sequelize";

// const sequelize=new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASS,
//   {
//     host: process.env.DB_HOST,
//     dialect: process.env.DB_DIALECT || "mysql",
//     logging: false,
//   }
// );

// const connectDB=async()=>{
//     try{
//         await sequelize.authenticate();
//         console.log("Database connected successfully");
//     }catch(error){
//         console.log("Database connection failed:",error.message);
//         process.exit(1);
//     }
// };

// export {connectDB} ;
// export default sequelize;

import Sequelize from "sequelize";
import fs from "fs";
import path from "path";

// Read the CA certificate
const caPath = path.resolve(process.env.DB_CA_PATH || "./src/CA.crt");
const caCert = fs.readFileSync(caPath);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306, // default MySQL port if not specified
    dialect: process.env.DB_DIALECT || "mysql",
    logging: false,
    dialectOptions: {
      ssl: {
        ca: caCert
      }
    }
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Database connection failed:", error.message);
    process.exit(1);
  }
};

export { connectDB };
export default sequelize;
