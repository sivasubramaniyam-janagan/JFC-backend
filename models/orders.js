import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    orderId:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:String,
        required:true},
    email:{
        type:String,
        required:true},
    firstname:{
        type:String,
        required:true},
    lastname:{
        type:String,
        required:true},
    date:{
        type:Date,
        required:true,
        default:Date.now
    },
    addressLine1:{
        type:String,
        required:true},
    addressLine2:{
        type:String},
    city:{
        type:String,
        required:true},
    notes:{
        type:String,
        default:""
    },    
    totalPrice:{
        type:Number,
        required:true},
    isPaid:{
        type:Boolean,
        default:false},
    status:{
        type:String,
        default:"Pending"},
    isDelivered:{
        type:Boolean,
        default:false},
    items:[{
        product:{
            productId:{
                type:String,
                required:true},
            name:{
                type:String,
                required:true},
            price:{
                type:Number,
                required:true},
            img:{
                type:String,
                required:true}
        },
        quantity:{
            type:Number,
            required:true}
    }]
    
});

export default mongoose.model("Order", orderSchema);


