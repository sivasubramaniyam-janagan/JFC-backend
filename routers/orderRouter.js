import Router from "express";
import { createOrder, getOrders, updateOrder } from "../controllers/orderController.js";

const orderRouter = Router();

orderRouter.post("/create-order", createOrder);
orderRouter.get("/get-orders/:pageNumber", getOrders);
orderRouter.put("/update-order/:orderId", updateOrder);

export default orderRouter;