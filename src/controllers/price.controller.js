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

    const {
      user,
      products,
    } = req.body;


    // ==========================================
    // USER REQUIRED
    // ==========================================

    if (!user) {

      return res.status(400).json({

        success: false,

        message:
          "User is required",

      });

    }


    // ==========================================
    // USER ID VALIDATION
    // ==========================================

    if (
      !mongoose.Types.ObjectId.isValid(user)
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Invalid user id",

      });

    }


    // ==========================================
    // GET USER
    // ==========================================

    const userData =
      await User
        .findById(user)
        .select(
          "name email number"
        )
        .lean();


    if (!userData) {

      return res.status(404).json({

        success: false,

        message:
          "User not found",

      });

    }


    // ==========================================
    // USER EMAIL REQUIRED
    // ==========================================

    if (!userData.email) {

      return res.status(400).json({

        success: false,

        message:
          "User email not found",

      });

    }


    // ==========================================
    // PRODUCTS REQUIRED
    // ==========================================

    if (
      !Array.isArray(products) ||
      products.length === 0
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Products are required",

      });

    }


    // ==========================================
    // PRODUCT VALIDATION
    // ==========================================

    const cleanProducts = [];


    for (
      const product of products
    ) {

      // ----------------------------------------
      // PRODUCT NAME
      // ----------------------------------------

      if (
        !product.productName ||
        !String(
          product.productName
        ).trim()
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Product name is required",

        });

      }


      // ----------------------------------------
      // PRODUCT IMAGE
      // ----------------------------------------

      if (
        !product.productImage ||
        !String(
          product.productImage
        ).trim()
      ) {

        return res.status(400).json({

          success: false,

          message:
            `Product image is required for ${product.productName}`,

        });

      }


      // ----------------------------------------
      // PRICE
      // ----------------------------------------

      if (
        product.price === undefined ||
        product.price === null ||
        product.price === ""
      ) {

        return res.status(400).json({

          success: false,

          message:
            `Price is required for ${product.productName}`,

        });

      }


      const productPrice =
        Number(product.price);


      if (
        Number.isNaN(productPrice) ||
        productPrice < 0
      ) {

        return res.status(400).json({

          success: false,

          message:
            `Invalid price for ${product.productName}`,

        });

      }


      // ----------------------------------------
      // QUANTITY
      // ----------------------------------------

      let quantity =
        Number(product.quantity);


      if (
        !quantity ||
        Number.isNaN(quantity) ||
        quantity <= 0
      ) {

        quantity = 1;

      }


      // ----------------------------------------
      // CLEAN PRODUCT
      // ----------------------------------------

      cleanProducts.push({

        productName:
          String(
            product.productName
          ).trim(),

        productImage:
          String(
            product.productImage
          ).trim(),

        quantity,

        price:
          productPrice,

      });

    }


    // ==========================================
    // SAVE ORDER
    // ==========================================

    const price =
      await Price.create({

        user,

        products:
          cleanProducts,

      });


    console.log(
      "✅ Order saved:",
      price._id.toString()
    );


    // ==========================================
    // GET LATEST ADDRESS
    // ==========================================

    const addressData =
      await Address
        .findOne({
          user,
        })
        .lean();


    let latestAddress = null;


    if (
      addressData &&
      Array.isArray(
        addressData.addresses
      ) &&
      addressData.addresses.length > 0
    ) {

      latestAddress =
        addressData.addresses[
          addressData.addresses.length - 1
        ];

    }


    // ==========================================
    // SEND EMAIL ONLY TO USER
    // ==========================================

    let emailSent = false;


    try {

      await sendOrderEmail({

        orderId:
          price._id.toString(),

        userName:
          userData.name,

        userEmail:
          userData.email,

        userNumber:
          userData.number,

        address:
          latestAddress,

        products:
          price.products,

      });


      emailSent = true;


      console.log(
        `✅ Order details sent to ${userData.email}`
      );


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
        ? "Order created and order details sent to user email"
        : "Order created but email could not be sent",

      emailSent,

      data:
        price,

    });


  } catch (error) {

    console.error(
      "❌ Create Price Error:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        error.message,

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