import { Router } from "express";
import {
    signup,
    verifyOTP,
    login,
    verifyOTP_login,


} from "../controllers/user.controllers.js";
import {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
} from "../controllers/address.controller.js";


import {
    createPrice,
    getProductsByUser,

} from "../controllers/price.controller.js";



const router = Router()
router.post("/signup", signup)
router.post("/login", login)
router.post("/signup-verifyOTP", verifyOTP)
router.post("/login-verifyOTP", verifyOTP_login)

// address
router.post("/add", addAddress);
router.get("/:user", getAddresses);
router.put("/:user/:addressId", updateAddress);
router.delete("/:user/:addressId", deleteAddress);




// Price Routes
router.post("/price/create", createPrice);
router.get("/product/:user", getProductsByUser);






export default router