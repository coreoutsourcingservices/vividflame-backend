import { User } from "../model/user.model.js";
import { saveOTP, getOTPData, deleteOTP, increaseAttempt } from "../util/otpStore.js";
import { sendEmailOTP } from "../util/mailer.js";
import bcrypt from "bcrypt"
import bodyParser from "body-parser";
import jwt from "jsonwebtoken"
export const signup = async (req, res) => {
    try {
        let {  name, email,number ,password } = req.body;
        email = email.trim().toLowerCase();
        if (!name || !number || !email || !password ) {
            res.status(400)
                .json({
                    message: "all fild requed ",
                    success: false
                })
        }
        const check_user = await User.findOne({ email })

        if (check_user) {
            return res.status(400)
                .json({
                    message: "email is already exist,you can login",
                    success: false
                })
        }

        const generateOTP = (length = 6) => {
            let otp = "";
            for (let i = 0; i < length; i++) {
                otp += Math.floor(Math.random() * 10);
            }
            return otp;
        };

        const otp = generateOTP(6);

        const hashPassword = await bcrypt.hash(password, 10);

        const dataSave = saveOTP(email, {
            otp,
            name,
            email,
            password: hashPassword,
           number,

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

        const user = await User.create({
            name: data.name,
            email: data.email,
            password: data.password,
           number:data.number,
        });
        const userResponse = user.toObject();

        delete userResponse.password;

        deleteOTP(email);

        res.json({
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
export const login = async (req, res) => {
    try {
        let { email, password, } = req.body;
        email = email.trim().toLowerCase();
        if (!email || !password) {
            res.status(400)
                .json({
                    message: "all fild requed ",
                    success: false
                })
        }
        const check_user = await User.findOne({ email })

        if (!check_user) {
            return res.status(400)
                .json({
                    message: "email is already not  exist,pleass you can signup",
                    success: false
                })
        }
        const checkPassword = await bcrypt.compare(password, check_user.password);
        if (!checkPassword) {
            return res.status(400).json({ message: "invalid password" });
        }

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

            name: check_user.name,

            DOB: check_user.DOB,
            gender: check_user.gender


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

export const verifyOTP_login = async (req, res) => {
    try {
        let { email, otp } = req.body
        email = email.trim().toLowerCase();
        const data = await getOTPData(email)


        if (!data) {
            return res.status(400).json({ message: "OTP expired or not found" });
        }

        if (data.expires < Date.now()) {
            deleteOTP(email);
            return res.status(400).json({ message: "OTP expired" });
        }

        if (data.attempts >= 5) {

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




        await deleteOTP(email);

        res.json({
            success: true,
            message: "login successfully",
            jwtTokem,
            name: data.name,
            email: data.email,
            number:data.number,
        });

    } catch (errer) {
        res.status(500)
            .json({
                message: `signup errer ${errer}`,
                success: false
            })
    }
}

