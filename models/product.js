import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    productId:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    labelledPrice:{
        type:Number,
        required:true},
    img:{
        type: [String],
        default: ["images/default-product.png", "images/default-product2.png"]
    },
    category:{
        type:String,
        required:true
    },
    isAvailable:{
        type:Boolean,
        default:true},
    
});

const Product = mongoose.model("Product", productSchema);
export default Product;