import Router  from "express";
import { createProduct } from "../controllers/productController.js";
import { getProducts } from "../controllers/productController.js";
import { editProduct } from "../controllers/productController.js";
import { deleteProduct } from "../controllers/productController.js";
const productRouter = Router();


productRouter.post("/add",createProduct); 
productRouter.get("/",getProducts);
productRouter.put("/edit-product/:productId", editProduct);
productRouter.delete("/delete-product/:productId", deleteProduct);


export default productRouter;