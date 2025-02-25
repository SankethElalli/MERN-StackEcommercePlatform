import mongoose from 'mongoose';
import colors from 'colors';

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not defined');
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err}`.red.bold);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected'.yellow.bold);
    });

    mongoose.connection.on('connected', () => {
      console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    });

    // Handle process termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      process.exit(0);
    });

  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    // Don't exit the process, let the application handle the error
    throw error;
  }
};

export default connectDB;
