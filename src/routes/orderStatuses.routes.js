import express from "express";
const router = express.Router();
import { OrderStatusController } from "../controllers";
import { AuthMiddleware } from "../middlewares";

router
    .get("/", AuthMiddleware, OrderStatusController.getOrderStatuses)
    .get("/:id", AuthMiddleware, OrderStatusController.getOrderStatus)
    .post("/", AuthMiddleware, OrderStatusController.createOrderStatus)
    .put("/", AuthMiddleware, OrderStatusController.updateOrderStatus)
    .delete("/", AuthMiddleware, OrderStatusController.deleteOrderStatus);

export { router as OrderStatusesRoutes };
