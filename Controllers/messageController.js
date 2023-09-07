const chatModel = require('../models/chatModel')
const userModel = require('../models/userModel')
const messageModel = require('../models/messageModel')
const expressAsyncHandler = require('express-async-handler')

const allMessages = expressAsyncHandler(async(req,res)=>{
    try{
        const messages = await messageModel.find({chat:req.params.chatId})
        .populate("sender","-password")
        .populate("receiver","-password")
        .populate("chat")
        res.status(200).json(messages)
    }
    catch(err){
        res.status(400)
        throw new Error(err.message)
    }
})  


const sendMessage = expressAsyncHandler(async(req,res)=>{
    const {content,chatId,userId} = req.body
    if(!content || !chatId){
        return res.status(400)
    }
    console.log(userId)
    var newMessage = {
        sender: userId,
        content: content,
        chat: chatId,
    };
    try{
        var message = await messageModel.create(newMessage)
        message = await message.populate("sender","-password")
        message = await message.populate("chat")
        message = await message.populate("receiver","-password")
        message = await userModel.populate(message,{
            path:"chat.user",
            select:"name email"
        })

        await chatModel.findByIdAndUpdate(req.body.chatId,{latestMessage:message})
        res.status(200).json(message)

    }
    catch(err){
        res.status(400)
        throw new Error(err.message)
    }
})


module.exports = { allMessages, sendMessage };