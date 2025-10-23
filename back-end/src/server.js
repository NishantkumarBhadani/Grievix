import dotenv from 'dotenv';
import { app } from './app.js';
import sequelize, { connectDB } from './db/index.js';

dotenv.config({
  path: './.env',
});

connectDB()
  .then(async () => {
    await sequelize.sync();

    const PORT = process.env.PORT || 3000;
    const HOST = '0.0.0.0';

    app.listen(PORT, HOST, () => {
      console.log(`Server is running on http://${HOST}:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("DB connection failed:", err.message);
  });
