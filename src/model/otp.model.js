import mongoose from "mongoose";
const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
  

  }, { timestamps: true })

export  const  Otp =mongoose.model("Otp",otpSchema)