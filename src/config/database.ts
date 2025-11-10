import mongoose from 'mongoose';
import logger from '../utils/logger';

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/todosDB';

export const connectDatabase = async (): Promise<void> => {
  try {
    const connection = await mongoose.connect(MONGODB_URI);

    logger.info(`MongoDB Connected: ${connection.connection.host}`);
    logger.info(`Database Name: ${connection.connection.name}`);

    mongoose.connection.on('error', (error) => {
      logger.error('MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed through app termination');
      process.exit(0);
    });
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed');
  } catch (error) {
    logger.error('Error closing MongoDB connection:', error);
    throw error;
  }
};
