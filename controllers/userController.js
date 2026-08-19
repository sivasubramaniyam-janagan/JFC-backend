import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import OTP from "../models/otp.js";

export function createUser(req, res) {
    const { firstname, lastname, email, password } = req.body;
    if (!firstname || !lastname || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({
        firstname,
        lastname,
        email,
        password: hashedPassword
    });
    newUser.save()
        .then((user) => {
            res.status(201).json({ message: "User created successfully", user });
        })
        .catch((err) => {
            res.status(500).json({ message: "Error creating user", err });
        });
    }

 export async function loginUser(req, res) {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        try{
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            if (user.isBlocked) {
                return res.status(403).json({ message: "User is blocked" });
            }
            const isPasswordValid = bcrypt.compareSync(password, user.password);
            if (!isPasswordValid) {
                console.log(isPasswordValid)
                return res.status(401).json({ message: "Invalid password" });
            }else{
                const payload ={
                    firstname:user.firstname,
                    lastname:user.lastname,
                    email:user.email,
                    isAdmin:user.isAdmin,
                    isBlocked:user.isBlocked,
                    img:user.img,
                    isEmailVerified:user.isEmailVerified
                }

                const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.status(200).json({ message: "Login successful", token, isAdmin:user.isAdmin});

            }
        }catch(err){
            console.error(err)
            res.status(500).json({ message: "Error logging in", err });
        }
    }


export async function googleLogin(req , res) {
    const accessToken = req.body.tokenResponse.access_token;
    try{
        const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                Authorization: `Bearer${accessToken}`,
            },
        });

        let user = await User.findOne({ email: response.data.email });

        if(user==null){
            const newUser = new User({
            firstname: response.data.given_name,
            lastname: response.data.family_name,
            email: response.data.email,
            img:response.data.picture,
            password: "JFC_Backend0752142111542151"
            });
            await newUser.save()
            user = await User.findOne({ email: response.data.email });
        }

        const payload ={
                    firstname:user.firstname,
                    lastname:user.lastname,
                    email:user.email,
                    isAdmin:user.isAdmin,
                    isBlocked:user.isBlocked,
                    img:user.img,
                    isEmailVerified:user.isEmailVerified
                }

        

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: "Login successful", token, isAdmin:user.isAdmin});
        }catch(err){
        res.status(500).json({ message: "Error logging in", err });
        console.error(err);
    }

}

export function isAdmin(req){
    if(req.user && req.user.isAdmin){
        return true;
    }
    return false;
}

export  async function getUsers(req, res) {
    if(!isAdmin(req)){
        return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }

    try{
        const users = await User.find({})
        res.status(200).json({ message: "Users retrieved successfully", users });
    }
    catch(err){
        res.status(500).json({ message: "Error getting users", err });
    }
}

export async function sendOTP(req, res) {
    const email = req.body.email;
    console.log(email);

    try{
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        await OTP.deleteMany({ email });
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const newOtp = new OTP({
            email: email,
            otp: otpCode
        });
        await newOtp.save();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.GMAIL,
                pass: process.env.GMAIL_APP_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.GMAIL,
            to: email,              // ← the actual recipient's email, from req.body / DB / wherever it comes from
            subject: "Your OTP Code",
            html:  `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #ff5722; margin: 0;">🍔  JFC</h2>
        </div>

        <h3 style="color: #333333; text-align: center;">Verify Your Email</h3>

        <p style="color: #555555; font-size: 15px; text-align: center; line-height: 1.5;">
            Use the OTP code below to complete your verification. This code is valid for a limited time.
        </p>

        <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; background-color: #fff3e0; color: #ff5722; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 16px 32px; border-radius: 8px; border: 1px dashed #ff5722;">
                ${otpCode}
            </span>
        </div>

        <p style="color: #999999; font-size: 13px; text-align: center;">
            If you didn't request this code, you can safely ignore this email.
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">

        <p style="color: #aaaaaa; font-size: 12px; text-align: center;">
            &copy; ${new Date().getFullYear()} JFC. All rights reserved.
        </p>
    </div>
    `
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Error sending email" });
            } else {
                return res.json({ message: "email sent successfuly" });
            }
        });
    }catch(err){
        res.status(500).json({ message: "Error sending OTP" });
        console.error(err);
    }

}

export async function verifyOTP(req,res){
    const email= req.body.email
    const otp=req.body.otp
    const password=req.body.password


    try{
        const recordOTP=await OTP.findOne({email:email})
        if(recordOTP==null){
            return res.status(400).json({message:"Invalid OTP"})
        }
        if(otp!=recordOTP.otp){
            return res.status(400).json({message:"Invalid OTP"})
        }

        const otpAgeMs = Date.now() - recordOTP.time.getTime();
        const otpAgeMinutes = otpAgeMs / (1000 * 60);

        if(otpAgeMinutes>5){
            return res.status(400).json({message:"OTP expired"})
        }

        const passwordHash=bcrypt.hashSync(password,10)
        await User.findOneAndUpdate({email:email},{password:passwordHash})
        await OTP.deleteOne({email:email})
        res.json({message:"password reset successfuly"})
    }
    catch(error){
        console.error(error)
        return res.status(500).json({message:"Error verifying OTP"})
        
    }


}