import { Price } from "../model/price.js";
import { User } from "../model/user.model.js";
import { Address } from "../model/addresses.js";
import { sendOrderEmail } from "../util/mailer.js";
import mongoose from "mongoose";
/**
 * Create Price
 */


export const createPrice = async (req, res) => {
  try {

    const { user, products } = req.body;


    // ==========================================
    // USER VALIDATION
    // ==========================================

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


    // Actual user DB me exist karta hai ya nahi
    const userData = await User
      .findById(user)
      .select("name email number")
      .lean();


    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }



    // ==========================================
    // PRODUCTS VALIDATION
    // ==========================================

    if (
      !Array.isArray(products) ||
      products.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Products are required",
      });
    }


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
          message:
            `Product image is required for ${product.productName}`,
        });
      }


      if (
        product.price === undefined ||
        product.price === null
      ) {
        return res.status(400).json({
          success: false,
          message:
            `Price is required for ${product.productName}`,
        });
      }


      if (
        !product.quantity ||
        Number(product.quantity) <= 0
      ) {
        product.quantity = 1;
      }

    }



    // ==========================================
    // SAVE ORDER
    // ==========================================

    const price = await Price.create({
      user,
      products,
    });



    // ==========================================
    // GET USER LATEST ADDRESS
    // ==========================================

    const addressData = await Address
      .findOne({ user })
      .lean();


    let latestAddress = null;


    if (
      addressData &&
      Array.isArray(addressData.addresses) &&
      addressData.addresses.length > 0
    ) {

      latestAddress =
        addressData.addresses[
          addressData.addresses.length - 1
        ];

    }



    // ==========================================
    // SEND ORDER EMAIL
    // ==========================================

    let emailSent = false;


    try {

      await sendOrderEmail({

        orderId: price._id.toString(),

        userName: userData.name,

        userEmail: userData.email,

        userNumber: userData.number,

        address: latestAddress,

        products: price.products,

      });


      emailSent = true;

    } catch (mailError) {

      console.error(
        "❌ Order saved but email failed:",
        mailError.message
      );

    }



    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(201).json({

      success: true,

      message: emailSent
        ? "Order created and email sent successfully"
        : "Order created successfully but email could not be sent",

      emailSent,

      data: price,

    });


  } catch (error) {

    console.error(
      "Create Price Error:",
      error
    );


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