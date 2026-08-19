import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    }, 
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    img:{
        type:String,
        default:"/images/default-profile.png"
    },
    isEmailVerified:{
        type:Boolean,
        default:false
    }
});

const User = mongoose.model("User",userSchema);
export default User;