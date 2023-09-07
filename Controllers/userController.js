const userModel = require("../models/userModel") 
const expressAsyncHandeler = require('express-async-handler')
const generateToken = require('../config/generateToken')

const registerController = expressAsyncHandeler(async (req,res)=>{
    const {name,email,password} = req.body;
    if(!name || !email || !password){
        res.status(400)
        throw Error("Data Not filled")
    }

    const emailExist = await userModel.findOne({email})
    if(emailExist){
        throw Error("Email already exist")
    }

    const usernameExist = await userModel.findOne({name})
    if(usernameExist){
        throw Error("UserName already taken")
    }

    const user = await userModel.create({name,email,password})
    if(user){
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin,
            token:generateToken(user._id)
        })
    }
    else{
        res.status(400)
        throw new Error("Registration error")
    }
})

const loginController = expressAsyncHandeler(async(req,res)=>{
    const {name,password} = req.body;
    const user = await userModel.findOne({name})
    if(user && await user.matchPassword(password)){
         res.status(200).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin,
            token: generateToken(user._id),
         })
    }
    else{
        throw new Error("username or Password is invalid")
    }
    
})


const fetchAllUsersController = expressAsyncHandeler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await userModel.find(keyword).find({
    _id: { $ne: req.user._id },
  });
  res.send(users);
});




module.exports ={loginController,registerController,fetchAllUsersController }