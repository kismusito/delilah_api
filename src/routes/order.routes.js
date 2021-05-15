import express from "express";
const router = express.Router();
import { OrderController } from "../controllers";
import { AuthMiddleware } from "../middlewares";

router
    .get("/", AuthMiddleware, OrderController.getOrders)
    .get("/:id", AuthMiddleware, OrderController.getOrder)
    .get("/products/:id", AuthMiddleware, OrderController.getOrderProducts)
    .get("/history/:id", AuthMiddleware, OrderController.getOrderStatusHistory)
    .post("/", AuthMiddleware, OrderController.createOrder)
    .put("/status", AuthMiddleware, OrderController.updateOrderStatus)
    .delete("/", AuthMiddleware, OrderController.deleteOrder);

export { router as OrderRoutes };
