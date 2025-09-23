import mongoose from "mongoose";


const userSchema= new mongoose.Schema({
    name: {type:String, required:true},
    email:{type:String, required:true, unique:true},
    password: {type:String, required:true},
    verifyOtp:{type:String, default:""},
    verifyOtpExpireAt:{type:Number, default:0},
    isverified:{type:Boolean, default:false},
    resetOtp: {type:String, default:""},
    resetOtpExpireAt:{type:Number, default:0}
})

const userModel =mongoose.models.user || mongoose.model('user', userSchema);
//check if the model already exists other wise no need to create a new one for every user.


export default userModel;