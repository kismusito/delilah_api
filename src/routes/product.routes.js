import express from "express";
const router = express.Router();
import { ProductController } from "../controllers";
import { AuthMiddleware, Upload, AccessControl } from "../middlewares";

router
    .get("/", ProductController.getProducts)
    .get("/:id", ProductController.getProduct)
    .post(
        "/",
        AuthMiddleware,
        AccessControl("admin"),
        Upload("uploads/products").single("productImage"),
        ProductController.createProduct
    )
    .put(
        "/",
        AuthMiddleware,
        AccessControl("admin"),
        Upload("uploads/products").single("productImage"),
        ProductController.updateProduct
    )
    .delete(
        "/",
        AuthMiddleware,
        AccessControl("admin"),
        ProductController.deleteProduct
    );

export { router as ProductRoutes };
