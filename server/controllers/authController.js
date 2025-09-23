import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js'

//using the userModel
export const register = async(req,res)=>{
    const{name, email, password}=req.body;
    if(!name || !email || !password){
        return res.json({success:false})
    }
    try{
        const existingUser=await userModel.findOne({email});
        if(existingUser){
            return res.json({sucess:false, message:"user already exists"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({name, email, password:hashedPassword})
        await user.save();

        //generate the token for auth
        const token=jwt.sign({id: user._id},process.env.JWT_SECRET, {expiresIn:"7d"});

        //send this token using cookie
        res.cookie('token', token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite: process.env.NODE_ENV==='production'?'none':'strict',
            maxAge: 7 *24 * 60*60*1000
        }); //(name, value) , secure: T/F rn is false cause we are , age in ms. 
        
        //success, send email

        const mailOptions={
            from:process.env.sender_email,
            to:email,
            subject:"Welcome to Auth",
            text: `Welcome to our website. Your account has been created with email id:${email}`
        }

        await transporter.sendMail(mailOptions);
        return res.json({success:true});

    }
    catch (error){
        res.json({success:false, message:error.message})
    }
}

export const login = async (req,res) =>{
    const {email, password}  = req.body;

    if(!email || !password){
        return res.json({success:false, message:"Email and password are required"})
    }

    try{
        const user= await userModel.findOne({email})

        if (!user){
            return res.json({sucess:false, message:"invalid email"})
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.json({sucess:false, message:"password doesnt match"})
        }

        //if password, email matched, geneerate a token

        const token=jwt.sign({id: user._id},process.env.JWT_SECRET, {expiresIn:"7d"});

        //send this token using cookie
        res.cookie('token', token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite: process.env.NODE_ENV==='production'?'none':'strict',
            maxAge: 7 *24 * 60*60*1000
        }); 

        return res.json({success:true});

    }
    catch(error){
        return res.json({success:false, message:error.message});
    }
}

export const logout = async (req, res)=>{

    try{
        res.clearCookie ('token',{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite: process.env.NODE_ENV==='production'?'none':'strict'
        })

        return res.json({success:true, message:"Logged Out"})

    }
    catch(error){
       return res.json({success:false, message:error.message}); 
    }
}

// export const sendVerifyOtp = async (req,res)=> {

//     try{
//         const userId = req.body;
//         const user = await userModel.findById(userId)
        
//         //isAccountVerified is in the schema of the user model
//         if (user.isAccountVerified) {
//             return res.json({success: false, message:"Account lready verified"})
//         }

//         const otp=String(Math.floor(100000+ Math.random()*900000))

//         user.verifyOtp = otp;
//         user.verifyOtpExpireAt= Date.now() + 24 * 60 *60 *1000
//         //expiry date is 24 hr

//         await user.save();

//         const mailOptions={
//             from:process.env.sender_email,
//             to: user.email,
//             subject:"Account Verification Otp",
//             text: `Your OTP is: ${otp}. Verify your account using this OTP`
//         }

//         await transporter.sendMail(mailOptions);

//         res.json({success:true, message:"Verification OTP Sent on Email"});
//     }
//     catch (error){
//         res.json({success:false, message:error.message})
//     }
// }

// export const verifyEmail = async(req,res) =>{

//     const {otp} = req.body;
//     const userId=req.body;

//     if (!userId || !otp){
//         return res.json({success:false, message:"Missing details"});
//     };

//     try{
//         const user= await userModel.findById(userId);
//         if(!user){
//             return res.json({success:false, message:"User not found"});
//         }
//         if (user.verifyOtp===''|| user.verifyOtp !== otp){
//             return res.json({success:false, message:"Invalid OTP"});
//         }
//         if (user.verifyOtpExpireAt < Date.now()){
//             //check expiration of otp
//             return res.json({success:false, message:"OTP expired"});
//         }

//         user.isAccountVerified= true;
//         user.verifyOtp='';
//         user.verifyOtpExpireAt=0;

//         await user.save();
//         return res.json({success:true, message:"Email verified succesfully"})

//     }
//     catch(error){
//         return res.json({success:false, message:error.message})
//     }
// }

// sendVerifyOtp
export const sendVerifyOtp = async (req, res) => {
  try {
    // read id from middleware
    const userId = req.userId;

    if (!userId) {
      return res.json({ success: false, message: "Not authorized. Missing user id." });
    }

    // find user
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // NOTE: your schema field name was `isverified` (lowercase) — adjust to match your model
    if (user.isverified) {
      return res.json({ success: false, message: "Account already verified" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    await user.save();

    const mailOptions = {
      from: process.env.sender_email,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Your OTP is: ${otp}. Verify your account using this OTP`
    };

    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "Verification OTP sent to email" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// verifyEmail
export const verifyEmail = async (req, res) => {
  try {
    const { otp } = req.body;
    const userId = req.userId;

    if (!userId || !otp) {
      return res.json({ success: false, message: "Missing details" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // same note about isverified field name
    if (!user.verifyOtp || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    user.isverified = true; // update to match your schema field name
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();
    return res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
