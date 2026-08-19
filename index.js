import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import  authenticateUser  from "./middlewares/authenticateUser.js";
import userRouter from "./routers/userRouter.js";
import productRouter from "./routers/productRouter.js";
import orderRouter from "./routers/orderRouter.js";
dotenv.config();
let app = express();

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("Database connected");
}).catch((err) => {
  console.error("Database connection error:", err);
});


app.use(cors());
app.use(express.json());
app.use(authenticateUser); // Use the authenticateUser middleware


app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);





app.listen(3000, () => {
  console.log("Server is running on port 3000");
});