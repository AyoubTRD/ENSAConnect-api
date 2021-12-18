import mongoose from 'mongoose';

export const initDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB successfully');
  } catch (e) {
    console.error(e);
  }
};
