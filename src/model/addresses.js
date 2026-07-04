import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    addresses: [
      {
        addressType: {
          type: String,
          enum: ["home", "office"],
          default: "home",
          required: true,
        },

        phoneNumber: {
          type: String,
          required: true,
          trim: true,
        },

        alternatePhoneNumber: {
          type: String,
          default: "",
          trim: true,
        },

        country: {
          type: String,
          required: true,
          default: "India",
          trim: true,
        },

        state: {
          type: String,
          required: true,
          trim: true,
        },

        city: {
          type: String,
          required: true,
          trim: true,
        },

        pinCode: {
          type: String,
          required: true,
          trim: true,
        },

        addressLine1: {
          type: String,
          required: true,
          trim: true,
        },

        addressLine2: {
          type: String,
          default: "",
          trim: true,
        },

        landmark: {
          type: String,
          default: "",
          trim: true,
        },

        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Address = mongoose.model("Address", addressSchema);