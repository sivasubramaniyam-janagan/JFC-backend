import Order from "../models/orders.js";
import Product from "../models/product.js";
import User from "../models/user.js";
import { isAdmin } from "./userController.js";

export async function createOrder(req, res) {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "User not logged in" });
    }
    

    const orderData = {
        orderId: "ORD00000001",
        phone:req.body.phone,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        date: new Date(),
        addressLine1: req.body.addressLine1,
        addressLine2: req.body.addressLine2,
        city: req.body.city,
        items:[],
        totalPrice: 0,
    };

    try{

        const lastOrder = await Order.findOne().sort({ date: -1 });
        if (lastOrder) {
            const lastOrderIdNumber = lastOrder.orderId.replace("ORD", "");
            const lastorderNumber = parseInt(lastOrderIdNumber);
            const newordernumber = (lastorderNumber + 1).toString();
            const newodernumberinstring = newordernumber.padStart(8, "0");
            orderData.orderId = "ORD" + newodernumberinstring;
        }

        for (let i = 0; i < req.body.items.length; i++) {
            const product = await Product.findOne({ productId: req.body.items[i].productId });
            if (!product) {
                return res.status(401).json({ message: "Product not found" });
            }
            else{
                orderData.items.push({
                    product: {
                        productId: product.productId,
                        name: product.name,
                        price: product.price,
                        img: product.img[0],
                    },
                    quantity: req.body.items[i].quantity,
                });
                orderData.totalPrice += product.price * req.body.items[i].quantity;
            }
        }
        await Order.create(orderData);
        res.status(201).json({ message: "Order created successfully" });
    }
    catch(err){
        res.status(500).json({ message: "Error creating order" });
        console.error(err);
    }
    }


export async function getOrders(req, res) {
    if (!req.user) {
        return res.status(401).json({ message: "User not logged in" });
    }

    try{
    const pageNumber  = req.params.pageNumber
    const pageSize = 10

    if(req.user.isAdmin){
        const orders = await Order.find().sort({ date: -1 }).skip((pageNumber - 1) * pageSize).limit(pageSize);
        const orderCount = await Order.countDocuments();
        const totalPages = Math.ceil(orderCount / pageSize);
        res.status(200).json({ orders, orderCount, totalPages });
    }
    
    else{
        const orders = await Order.find({ email: req.user.email }).sort({ date: -1 }).skip((pageNumber - 1) * pageSize).limit(pageSize);
        const orderCount = await Order.countDocuments({ email: req.user.email });
        const totalPages = Math.ceil(orderCount / pageSize);
        res.status(200).json({ orders, orderCount, totalPages });
    }
    }catch(err){
        res.status(500).json({ message: "Error getting orders" });
        console.error(err);
    }


}

export async function updateOrder(req, res) {
    if(!isAdmin(req)){
        return res.status(401).json({ message: "User not authorized" });
    }
    try{
        await Order.findOneAndUpdate({ orderId: req.params.orderId },{status:req.body.status});
        res.status(200).json({ message: "Order updated successfully" });
    }
    catch(err){
        res.status(500).json({ message: "Error updating order" });
        console.error(err);
    }
}
    
