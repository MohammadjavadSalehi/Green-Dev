import mongoose from "mongoose";

const connect = async () => {
  try {
    console.log(process.env.MONGO);
    await mongoose.connect(process.env.MONGO);
  } catch (error) {
    console.log(error);
    throw new Error("Connection failed!");
  }
};

export default connect;
