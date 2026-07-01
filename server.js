import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { sendOtp, verifyOTP } from "./src/controllers/otp.controllers.js";
import { connectDB } from "./src/db/db.js";
dotenv.config();
connectDB()
const port = process.env.PORT || 5050
const app = express();
app.use(cors({
    origin: "https://vividflame.in",
    credentials: true,
    methods: ["GET","POST","PUT","DELETE","OPTIONS"],
    allowedHeaders: ["Content-Type","Authorization"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.send("hello")
})

app.post("/send-otp", sendOtp);
app.post("/verify-otp", verifyOTP);
app.listen(port, () => {
    console.log(`port = ${port}`)
})