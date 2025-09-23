import jwt from 'jsonwebtoken';

//we are extracting userId from token. userId is used in authentication with otp etc. 

/*
when we hit the api endpoint, this middle ware execut. we get token from cookie then from token we get id. 

*/
const userAuth = async (req, res, next)=>{
    const {token} = req.cookies;

    if(!token) {
        return res.json({success:false, message:"Not Authorized. Login Again"})
    }

    try{

        const tokenDecode= jwt.verify(token, process.env.JWT_SECRET);

        if(tokenDecode.id){
            req.userId = tokenDecode.id
        } else{
            return res.json ({success:false, message:"Not Authorized Login Again"})
        }

        next(); //it will execute our controller

    }
    catch(error){
        return res.json({success:false, message: error.message})
    }
} 

export default userAuth;

