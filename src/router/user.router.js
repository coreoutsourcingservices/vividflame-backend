import { Router } from "express";
import {
    signup,
    verifyOTP,
    login,
    verifyOTP_login,


} from "../controllers/user.controllers.js";

const router = Router()
router.post("/signup", signup)
router.post("/login", login)
router.post("/signup-verifyOTP", verifyOTP)
router.post("/login-verifyOTP", verifyOTP_login)



export default router