import { Price } from "../model/price.js";
import mongoose from "mongoose";
/**
 * Create Price
 */
export const createPrice = async (req, res) => {
    try {
        const { user, products } = req.body;

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User is required",
            });
        }

        if (!products || products.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Products are required",
            });
        }

        const price = await Price.create({
            user,
            products,
        });

        return res.status(201).json({
            success: true,
            message: "Price created successfully",
            data: price,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



export const getProductsByUser = async (req, res) => {
    try {
        const { user } = req.params;

        if (!mongoose.Types.ObjectId.isValid(user)) {
            return res.status(400).json({
                success: false,
                message: "Invalid User ID",
            });
        }

        const price = await Price.findOne({ user }).lean();

        if (!price) {
            return res.status(404).json({
                success: false,
                message: "No products found for this user",
            });
        }

        return res.status(200).json({
            success: true,
            totalProducts: price.products.length,
            products: price.products,
            grandTotal: price.grandTotal,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
