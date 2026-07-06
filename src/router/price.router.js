
import { Router } from "express";
import {
    createPrice,
    getProductsByUser,

} from "../controllers/price.controller.js";
const router = Router()

router.post("/price/create", createPrice);
router.get("/product/:user", getProductsByUser);
export default router