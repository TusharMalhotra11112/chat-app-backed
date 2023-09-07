const express = require('express')
const dotenv = require('dotenv')
const { mongoose } = require('mongoose')
const userRoutes = require('./Routes/userRoutes')
const chatRoutes = require('./Routes/chatRoutes')
const messageRoutes = require('./Routes/messageRoutes')
const cors = require("cors");

const app = express()
app.use(cors({
    origin:'*',
}))
dotenv.config()

app.use(express.json())

app.get("/",(req,res)=>{
    res.send("hello world")
})

app.use('/user',userRoutes)
app.use('/chat',chatRoutes)
app.use('/message',messageRoutes)


const PORT = process.env.PORT || 5000

const connectdb = async ()=>{
    try{
        const connect = await mongoose.connect(process.env.MONGO_URI)
        console.log("server is connected")
    }
    catch(err){
        console.log("server is not connected",err.message)
    }
}
connectdb()

app.listen(PORT,console.log("server is running"))
