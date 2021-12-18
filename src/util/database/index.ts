import mongoose from "mongoose";

export const initDb = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://ayoub:ayoubtrd@cluster0.p6arv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    );
    console.log("Connected to MongoDB successfully");
  } catch (e) {
    console.error(e);
  }
};
