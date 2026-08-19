import Product from "../models/product.js";
import { isAdmin } from "../controllers/userController.js";

export async function createProduct(req, res) {
    if (!isAdmin(req)) {
        return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }
    const { productId, name, price, labelledPrice, description, img, category, isAvailable } = req.body;
    
    if(!productId || !name || !price || !labelledPrice || !category) {
        return res.status(400).json({ message: "All required fields must be provided" });
    }

    try{
        const existingProduct = await Product.findOne({ productId });
        if(existingProduct) {
        return res.status(400).json({ message: "Product with this ID already exists" });
        }
    const product=new Product({
        productId,
        name,
        price,
        labelledPrice,
        description,
        img,
        category,
        isAvailable
    });
    await product.save();
    res.status(201).json({ message: "Product created successfully", product });
    }catch(err){
        res.status(500).json({ message: "Error creating product", err });
        console.error(err);
    }
}

export async function getProducts(req , res) {
    try{
        if(isAdmin(req)){
            const products = await Product.find({});
            res.status(200).json({ message: "Products retrieved successfully", products });
        }else{
            const products = await Product.find({ isAvailable: true });
            res.status(200).json({ message: "Products retrieved successfully", products });
        }
        
    }
    catch(err){
        res.status(500).json({ message: "Error getting products", err });
        console.error(err);
    }
}

export async function editProduct(req, res) {
    if (!isAdmin(req)) {
        return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }

    try{
        const { productId } = req.params;
        const { name, price, labelledPrice, description, img, category, isAvailable } = req.body;
        if(!productId || !name || !price || !labelledPrice || !category) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        await Product.findOneAndUpdate({ productId }, { name, price, labelledPrice, description, img, category, isAvailable });
        res.status(200).json({ message: "Product updated successfully" });
       
    }
    catch(err){
        res.status(500).json({ message: "Error editing product" });
        console.error(err);
    }


}

export async function deleteProduct(req,res) {
    if(!isAdmin(req)){
        return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }

    try{
        const { productId } = req.params;
        const result = await Product.findOneAndDelete({ productId });
        if (!result) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    }catch(err){
        res.status(500).json({ message: "Error deleting product" });
        console.error(err);
    }

    
}