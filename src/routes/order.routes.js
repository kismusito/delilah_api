import express from "express";
const router = express.Router();
import { OrderController } from "../controllers";
import { AuthMiddleware, AccessControl } from "../middlewares";

router
    .get("/", AuthMiddleware, AccessControl("admin"), OrderController.getOrders)
    .get(
        "/:id",
        AuthMiddleware,
        AccessControl("admin"),
        OrderController.getOrder
    )
    .get(
        "/products/:id",
        AuthMiddleware,
        AccessControl("admin"),
        OrderController.getOrderProducts
    )
    .get(
        "/history/:id",
        AuthMiddleware,
        AccessControl("admin"),
        OrderController.getOrderStatusHistory
    )
    .post(
        "/",
        AuthMiddleware,
        AccessControl("admin"),
        OrderController.createOrder
    )
    .put(
        "/status",
        AuthMiddleware,
        AccessControl("admin"),
        OrderController.updateOrderStatus
    )
    .delete(
        "/",
        AuthMiddleware,
        AccessControl("admin"),
        OrderController.deleteOrder
    );

export { router as OrderRoutes };
