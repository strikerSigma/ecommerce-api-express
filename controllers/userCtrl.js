const generateJWT = require('../config/jwtToken');
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')


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
        const user = await User.findOne({email})
        if(user && await user.isPasswordMatched(password)){
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
    const {id} = req.params;
    try{
        const updatedUser = await User.findByIdAndUpdate({_id:id},{
            _id: req?.body?._id,
            firstName: req?.body?.firstName,
            lastName: req?.body?.lastName,
            email: req?.body?.email,
            mobile: req?.body?.mobile,
            password: req?.body?.password
        });
        if(!updatedUser) throw new Error("user does not exist");
        res.json({msg: "user updated successfully!"});
    }catch(err){
        throw new Error(err);
    }
}) 
module.exports = {createUser,loginUserCtrl,getAllUsers,getUser,deleteUser,updateUser}