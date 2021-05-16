import express from "express";
const router = express.Router();
import { OrderStatusController } from "../controllers";
import { AuthMiddleware, AccessControl } from "../middlewares";

router
    .get(
        "/",
        AuthMiddleware,
        AccessControl("admin"),
        OrderStatusController.getOrderStatuses
    )
    .get(
        "/:id",
        AuthMiddleware,
        AccessControl("admin"),
        OrderStatusController.getOrderStatus
    )
    .post(
        "/",
        AuthMiddleware,
        AccessControl("admin"),
        OrderStatusController.createOrderStatus
    )
    .put(
        "/",
        AuthMiddleware,
        AccessControl("admin"),
        OrderStatusController.updateOrderStatus
    )
    .delete(
        "/",
        AuthMiddleware,
        AccessControl("admin"),
        OrderStatusController.deleteOrderStatus
    );

export { router as OrderStatusesRoutes };
