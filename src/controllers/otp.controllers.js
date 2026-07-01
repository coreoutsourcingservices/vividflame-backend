import { Otp } from "../model/otp.model.js"
import { sendEmailOTP } from "../util/mailer.js"
import { saveOTP, getOTPData, deleteOTP } from "../util/otpStore.js"
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const sendOtp = async (req, res) => {
    try {
        let { email, } = req.body;
        email = email.trim().toLowerCase();
        if (!email) {
            res.status(400)
                .json({
                    message: "all fild requed ",
                    success: false
                })
        }
        const check_user = await Otp.findOne({ email })
        //  if (check_user) {
        //     return res.status(400)
        //         .json({
        //             message: "email is already exist,you can login",
        //             success: false
        //         })
        // }
        const generateOTP = (length = 6) => {
            let otp = "";
            for (let i = 0; i < length; i++) {
                otp += Math.floor(Math.random() * 10);
            }
            return otp;
        };

        const otp = generateOTP(6);
        const dataSave = saveOTP(email, {
            otp,

            email,


        });
        const existingOTP = await sendEmailOTP(email, otp);
        if (existingOTP && existingOTP.expires > Date.now()) {
            return res.json({ message: "OTP already sent. Please wait." });
        }
        res.json({
            success: true,

            message: "OTP sent",
            dataSave
        });
    }
    catch (errer) {
        res.status(201)
            .json({
                message: `signup errer ${errer}`,
                success: false
            })
    }
}


export const verifyOTP = async (req, res) => {
    try {
        let { email, otp } = req.body
        email = email.trim().toLowerCase();
        const data = getOTPData(email)

        if (!data) {
            return res.status(400).json({ message: "OTP expired or not found" });
        }

        if (data.expires < Date.now()) {
            deleteOTP(email);
            return res.status(400).json({ message: "OTP expired" });
        }
        if (data.attempts >= 4) {

            deleteOTP(email);

            return res.status(400).json({
                success: false,
                message: "Too many wrong attempts"
            });
        }


        if (data.otp !== otp) {

            const attempts = increaseAttempt(email);

            return res.status(400).json({
                success: false,
                message: `Invalid OTP. Attempts ${attempts}/5`
            });
        }



        const jwtTokem = jwt.sign(
            {
                email: data.email
            },
            process.env.JWT_KEY,
            { expiresIn: '6h' }
        )
        res.cookie("token", jwtTokem, {
            httpOnly: true,
            secure: false, // production me true
            maxAge: 6 * 60 * 60 * 1000
        })

        const user = await Otp.create({

            email: data.email,

        });
        const userResponse = user.toObject();

        delete userResponse.password;

        deleteOTP(email);

        res.status(201).json({
            success: true,
            message: "Signup successfully",
            jwtTokem,
            user: userResponse
        });

    } catch (errer) {
        res.status(500)
            .json({
                message: `signup errer ${errer}`,
                success: false
            })
    }
}