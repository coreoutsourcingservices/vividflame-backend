import { Router } from "express";
import {
    signup,
    verifyOTP,
    login,
    verifyOTP_login,
    getAllUsers,


} from "../controllers/user.controllers.js";
import {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
} from "../controllers/address.controller.js";




const router = Router()
router.post("/signup", signup)
router.post("/login", login)
router.post("/signup-verifyOTP", verifyOTP)
router.post("/login-verifyOTP", verifyOTP_login)

// address
// Price Routes


router.post("/add", addAddress);
router.get("/api",getAllUsers)
router.get("/:user", getAddresses);
router.put("/:user/:addressId", updateAddress);
router.delete("/:user/:addressId", deleteAddress);








export default router