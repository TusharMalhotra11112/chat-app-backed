const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userModel = mongoose.Schema({
    name:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
    },
    password:{
        type:String,
        require:true,
    },

},
{
    timeStamp:true,
})


userModel.methods.matchPassword = async function (enteredPassword) {
  return (enteredPassword === this.password)
};

// userModel.pre("save", async function (next) {
//   if (!this.isModified) {
//     next();
//   }

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

const User = mongoose.model("User",userModel)
module.exports = User