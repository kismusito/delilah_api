import express from "express";
const router = express.Router();
import { ProductController } from "../controllers";
import { AuthMiddleware, Upload } from "../middlewares";

router
    .get("/", ProductController.getProducts)
    .get("/:id", ProductController.getProduct)
    .post(
        "/",
        AuthMiddleware,
        Upload("uploads/products").single("productImage"),
        ProductController.createProduct
    )
    .put(
        "/",
        AuthMiddleware,
        Upload("uploads/products").single("productImage"),
        ProductController.updateProduct
    )
    .delete("/", AuthMiddleware, ProductController.deleteProduct);

export { router as ProductRoutes };
