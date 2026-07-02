import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    number: {
        type: String,
        required: true,
        trim: true,
    },

    dob: {
        type: Date,
        required: true,
    },
    age:{
          type: Number,
    },

    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female", "Other"],
    },

    password: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});

export const User = mongoose.model("User", userSchema);