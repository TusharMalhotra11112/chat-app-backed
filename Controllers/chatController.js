const chatModel = require('../models/chatModel')
const userModel = require('../models/userModel')
const asyncHandeler = require('express-async-handler')


const accessChat = asyncHandeler(async(req,res)=>{
    const {userId,name} = req.body
    // console.log(name)
    if (!userId) {
        console.log("UserId param not sent with request");
        return res.sendStatus(400);
    }

    var isChat = await chatModel.find({
        isGroupChat:false,
        $and:[
            {users:{$elemMatch:{$eq:req.user._id}}},
            {users:{$elemMatch:{$eq:userId}}}
        ],
    })
    .populate("users","-password")
    .populate("latestMessage")

    isChat = await userModel.populate(isChat,{
        path:"latestMessage.sender",
        select:"name email",
    })

    if(isChat.length>0){
        res.send(isChat[0])
    }

    else{
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        }
        try{
            const createdChat = await chatModel.create(chatData);
            const FullChat = await chatModel.findOne({ _id: createdChat._id }).populate("users","-password")
            res.status(200).json(FullChat);
        }
        catch(err){
            res.status(400)
            throw new Error(err.message)
        }
    }
})

const fetchChat = asyncHandeler( async(req,res)=>{
    try{
        chatModel.find({users:{$elemMatch:{$eq:req.user._id}}})
        .populate("users","-password")
        .populate("groupAdmin","-password")
        .populate("latestMessage")
        .sort({updatedAt:-1})
        .then(async(results)=>{
            results = await userModel.populate(results,{
                path:"latestMessage.sender",
                select:"name email",
            })
        res.status(200).send(results)
        })
        
    }
    catch(err){
        res.status(400)
        throw new Error(err.message)
    }
})

const fetchGroups  =asyncHandeler( async(req,res)=>{
    try{
        const allgroup = await chatModel.where("isGroupChat").equals(true)
        res.status(200)
        res.send(allgroup)
    }
    catch(err){
        res.status(400)
        throw new Error(err.message)
    }
})

const createGroupChat =asyncHandeler( async(req,res)=>{

    if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Data is insufficient" });
    }

    var allusers = req.body.users    
    allusers.push(req.user._id)

    // console.log("err here")
    try{
        const groupChat = await chatModel.create({
            chatname:req.body.name,
            isGroupChat:true,
            users:allusers,
            groupAdmin:req.user,
        })

        const fullGroupChat = await chatModel.findOne({_id:groupChat._id})
        .populate("users","-password")
        .populate("groupAdmin","-password")
        res.status(200).send(fullGroupChat)
    }
    catch(err){
        res.status(400)
        throw new Error(err.message)
    }
})

const groupExit =asyncHandeler( async(req,res)=>{
    const { chatId, userId } = req.body;
    
    const removed = await chatModel.findByIdAndUpdate(
        chatId,
        {
            $pull:{users:userId}
        },
        {
            new:true,
        },
    )
    .populate("users","-password")
    .populate("groupAdmin","-password")

    if(!removed){
        res.status(400)
        throw new Error("chat not found")

    }
    else{
        res.json(removed)
    }

})


module.exports = {accessChat,fetchChat,fetchGroups,createGroupChat,groupExit}