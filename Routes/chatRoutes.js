const express = require('express')
const { protect } = require('../Middleware/authmiddleware')
const { accessChat,fetchChat, createGroupChat, fetchGroups, groupExit } = require('../Controllers/chatController')

const router = express.Router()
router.route("/").post(protect,accessChat)
router.route("/").get(protect, fetchChat)
router.route("/fetchGroups").get(protect, fetchGroups);
router.route("/createGroup").post(protect, createGroupChat);
router.route("/groupExit").put(protect, groupExit);




module.exports = router