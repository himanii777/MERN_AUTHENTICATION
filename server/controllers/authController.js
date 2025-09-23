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