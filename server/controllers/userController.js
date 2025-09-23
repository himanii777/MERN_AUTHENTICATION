import userModel from "../models/userModel.js";

// export const getUserData = async (req,res)=>{

//     try{
//         const {userId}= req.body;

//         const user= await userModel.findById(userId);

//         if(!user){
//             return res.json({success:false, message:"User not found"})
//         };

//         res.json({
//             success:true, 
//             userData:{
//                 name:user.name,
//                 isAccountVerified: user.isAccountVerified
//             }
//         });

//     }
//     catch (error){
//         res.json({success:false, message: error.message});
//     }
// }



export const getUserData = async (req, res) => {
  try {
    const userId = req.userId;               // <- read id from middleware, not req.body
    if (!userId) {
      return res.json({ success: false, message: "Not authorized (missing user id)" });
    }

    // select only the fields you want to expose
    const user = await userModel.findById(userId).select("name isverified email");
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    return res.json({
      success: true,
      userData: {
        name: user.name,
        email: user.email,
        // translate model field to a friendly name
        isAccountVerified: !!user.isverified
      }
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
