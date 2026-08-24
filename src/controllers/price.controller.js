import { Price } from "../model/price.js";
import mongoose from "mongoose";
/**
 * Create Price
 */


export const createPrice = async (req, res) => {
    try {
        const { user, products } = req.body;

        // User validation
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User is required",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(user)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user id",
            });
        }

        // Products validation
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Products are required",
            });
        }

        // Validate every product
        for (const product of products) {
            if (!product.productName) {
                return res.status(400).json({
                    success: false,
                    message: "Product name is required",
                });
            }

            if (!product.productImage) {
                return res.status(400).json({
                    success: false,
                    message: `Product image is required for ${product.productName}`,
                });
            }

            if (!product.price && product.price !== 0) {
                return res.status(400).json({
                    success: false,
                    message: `Price is required for ${product.productName}`,
                });
            }

            if (!product.quantity) {
                product.quantity = 1;
            }
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
        console.error("Create Price Error:", error);

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

        const orders = await Price.find({ user })
            .sort({ createdAt: -1 })
            .lean();

        if (!orders.length) {
            return res.status(404).json({
                success: false,
                message: "No orders found",
            });
        }

        return res.status(200).json({
            success: true,
            totalOrders: orders.length,
            orders,
        });

    } catch (error) {

        return res.status(500).json({
            success:false,
            message:error.message
        });

    }
};