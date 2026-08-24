import { User } from "../model/user.model.js";
import { saveOTP, getOTPData, deleteOTP, increaseAttempt } from "../util/otpStore.js";
import { sendEmailOTP } from "../util/mailer.js";
import bcrypt from "bcrypt"
import bodyParser from "body-parser";
import jwt from "jsonwebtoken"

const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }

    return age;
};


export const signup = async (req, res) => {
    try {
        let { name, email, number, dob, password, gender } = req.body;
        email = email.trim().toLowerCase();
        if (!name || !number || !email || !password || !dob || !gender) {
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
            dob,
            gender,
            age: calculateAge(dob),

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

        )
        res.cookie("token", jwtTokem, {
            httpOnly: true,
            secure: false, // production me true

        })

        const user = await User.create({
            name: data.name,
            email: data.email,
            password: data.password,
            number: data.number,
            dob: data.dob,
            age: data.age,
            gender: data.gender,
        });
        const userResponse = user.toObject();

        delete userResponse.password;

        deleteOTP(email);

        res.json({
            success: true,
            message: "Signup successfully",
            jwtTokem,
            userId: user._id,   // 👈 User ID
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
        let { email } = req.body;
        email = email.trim().toLowerCase();
        if (!email) {
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
                    message: "user not found ,pleass you can signup",
                    success: false
                })
        }
        // const checkPassword = await bcrypt.compare(password, check_user.password);
        // if (!checkPassword) {
        //     return res.status(400).json({ message: "invalid password" });
        // }

        const generateOTP = (length = 6) => {
            let otp = "";
            for (let i = 0; i < length; i++) {
                otp += Math.floor(Math.random() * 10);
            }
            return otp;
        };

        const otp = generateOTP(6);
        const {
            _id,
            name,
            email: userEmail,
            number,
            dob,
            age,
            gender,
            password
        } = check_user;

        const dataSave = saveOTP(email, {
            otp,
            _id,
            name,
            email: userEmail,
            number,
            dob,
            age,
            gender,
            password
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

        )
        res.cookie("token", jwtTokem, {
            httpOnly: true,
            secure: false, // production me true

        })




        await deleteOTP(email);

        res.json({
            success: true,
            message: "login successfully",
            jwtTokem,
            userId: data._id,   // 👈 ID
            name: data.name,
            email: data.email,
            number: data.number,
            dob: data.dob,
            age: data.age,
            gender: data.gender,
        });

    } catch (errer) {
        res.status(500)
            .json({
                message: `signup errer ${errer}`,
                success: false
            })
    }
}

 
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({})
            .select("-password")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            total: users.length,
            data: users,
        });

    } catch (error) {
        console.error("Get All Users Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch users",
            error: error.message,
        });
    }
};

