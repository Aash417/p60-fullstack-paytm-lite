import mongoose, { Mongoose } from 'mongoose';

const connectDB = async () => {
  try {
    const conn: Mongoose = await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.DB}`
    );

    console.log(`Database is connected at : ${conn.connection.host}`);
  } catch (error) {
    console.log('mongo connection error: ', error);
    process.exit(1);
  }
};

export default connectDB;
