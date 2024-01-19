const generateJWT = require('../config/jwtToken');
const refreshJWT = require('../config/refreshJWT');
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
const sendMail = require('./email');

const createUser = asyncHandler(async(req,res)=>{
    const body = req.body;
    const findUser = await User.findOne(body);
    if(!findUser){
        //Create a new user
        
        const newUser = await User.create(body);
        
        res.json(newUser);
    }else{
        throw new Error("User already Exists")
    }
})
//login the user
const loginUserCtrl = asyncHandler(async(req,res)=>{
    const {email,password} = req.body;
        const user = await User.findOne({email,password})
        const refrehToken = await refreshJWT(user?._id);
        const updateUser = await User.findByIdAndUpdate(user?.id,
            { refrehToken},
            {new: true})
        res.cookie("refreshToken", refrehToken,
        {httpOnly: true,maxAge: 24*60*60*1000 })
        if(user){ 
            res.json({
            _id: user._id,
            firstname: user.firstName,
            lastname: user.lastName,
            email: user.email,
            mobile: user.mobile,
            token: generateJWT(user._id)
        });
        }
        else throw new Error("An Error occured with login");
        
        
    console.log(email,password);
})
// get all users 
const getAllUsers = asyncHandler(async(req,res)=>{
    try{
        const users = await User.find();
        res.json(users);
    }catch(err){
        throw new Error(err);
    }
})
// get single user 
const getUser = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try{
        const users = await User.findById({_id:id});
        res.json(users);
    }catch(err){
        throw new Error(err);
    }
})
// delete a user 
const deleteUser = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try{
        const deleteduser = await User.deleteOne({_id:id});
        if(deleteduser.deletedCount === 0) throw new Error("user does not exist");
        res.json({deleteduser,msg: "user deleted successfully!"});
    }catch(err){
        throw new Error(err);
    }
}) 
// update a user 
const updateUser = asyncHandler(async(req,res)=>{
    const {id} = req.user;
    console.log(id);
    try{
        const updatedUser = await User.findByIdAndUpdate({_id:id},{
            firstName: req?.user?.firstName,
            lastName: req?.user?.lastName,
            email: req?.user?.email,
            mobile: req?.user?.mobile,
            password: req?.user?.password
        });
        if(!updatedUser) throw new Error("user does not exist");
        res.json({msg: "user updated successfully!"});
    }catch(err){
        throw new Error(err);
    }
}) 
//logout user
const logoutUser = asyncHandler(async(req,res)=>{
    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error('Refresh token missing');
    const refreshToken = cookie.refreshToken;
    await User.findOneAndUpdate({refreshToken},{
        refreshToken: ""
    })
    res.clearCookie("refreshToken",{
        httpOnly: true, secure: true
    });
    return res.sendStatus(204);
})
//handle refresh token
const handleRefreshToken = asyncHandler(async(req,res)=>{
    const cookie = req.cookies;
    console.log(cookie)
    if(!cookie?.refreshToken) throw new Error('Refresh token missing');
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken});
    const decoded  = jwt.verify(refreshToken, process.env.JWT_SECRET);
    console.log(decoded)
    if(!user) throw new Error('Express token expired');
    const newToken =refreshJWT(user?._id)
    // res.cookie('refreshToken',newToken)
    res.json({newToken})
})
//block user
const blockUser = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try{
        const block =await User.findByIdAndUpdate(id,{
            isBlocked: true,
        },
        {
            new: true
        })
         res.json({msg: "User blocked"})
    } catch(err){
        throw new Error(err);
    }
})
//unblock user
const unBlockUser = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try{
        await User.findByIdAndUpdate(id,{
            isBlocked: false,
        },
        {
            new: true
        })
        res.json({msg: "User unblocked"})
    } catch(err){
        throw new Error(err);
    }
})

const updatePassword = asyncHandler(async (req, res)=>{
    const {email} = req.body;
    const user = await User.findOne({ email: email });
    if(!user) throw new Error(`User with email: ${email} does not exist`);
    const secret =  process.env.JWT_PASSWORD_RESET+ user._id;
    const payload = {email,id:user._id};
    const token = jwt.sign(payload, secret, {expiresIn: '30m'});
     await User.findByIdAndUpdate({_id:user._id},{
           passwordResetToken: token,
           JWTsecret: secret
        });
    // const link = `https://localhost:4000/api/user/password/${user._id}/${token}`;
    //handle email
    const subject = "your token, do not share it with others, validity: 30m "
    sendMail(email,subject,token).then(result => console.log(result)).catch(err => {throw new Error(err)});

    res.json({message: "token has been sent to your email"})
})
const resetPassword = asyncHandler(async(req,res)=>{
    const {email, token, password} = req.body;
    const user = await User.findOne({ email});
    const decodedToken = jwt.verify(token, user.JWTsecret);
    if(!decodedToken) throw new Error('Invalid token');
    const updatedUser = await User.updateOne({email},{
           password,
           passwordResetToken: null,
           JWTsecret: null
        });
    res.json({message: "Password has been successfully updated"})
})
module.exports = {createUser,loginUserCtrl,
    getAllUsers,getUser,
    deleteUser,updateUser,
    blockUser,unBlockUser,
    logoutUser,
    resetPassword,
    handleRefreshToken,
    updatePassword}