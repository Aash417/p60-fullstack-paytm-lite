import dotenv from 'dotenv';
import { app } from './app';
import connectDB from './db/index';
dotenv.config({ path: './config.env' });

process.on('uncaughtException', err => {
  console.log('Uncaught Exception');
  console.log(err.name, err.message);
  console.log(err.stack);
  process.exit(1);
});

connectDB()
  .then(() => {
    app.listen(4000, () => {
      console.log(`server is running at : ${process.env.PORT}`);
    });
  })
  .catch(err => console.log(`mongo db error : ${err}`));
