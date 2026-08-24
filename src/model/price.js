import mongoose from "mongoose";

const priceSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        products: [
            {


                productName: {
                    type: String,
                    required: true,
                    trim: true,
                },
                productImage:{
                    type:String,
                    required:true
                },

                quantity:{
                    type: Number,
                    required: true,
                    min: 1,
                    default: 1,
                },

                price: {
                    type: Number,
                    required: true,
                    min: 0,
                },

                totalPrice: {
                    type: Number,
                    default: 0,
                },

            },

        ],

        grandTotal: {
            type: Number,
            default: 0,
        }


    },
    {
        timestamps: true,
    }
);

// Automatically calculate prices before saving
priceSchema.pre("save", function () {
    let total = 0;

    this.products.forEach((item) => {
        item.totalPrice = item.quantity * item.price;
        total += item.totalPrice;
    });

    this.grandTotal = total;
});
export const Price = mongoose.model("Price", priceSchema);