import express from "express";
const router = express.Router();
import { PaymentMethodController } from "../controllers";
import { AuthMiddleware, AccessControl } from "../middlewares";

router
    .get("/", PaymentMethodController.getPaymentMethods)
    .get("/:id", PaymentMethodController.getPaymentMethod)
    .post(
        "/",
        AuthMiddleware,
        AccessControl("admin"),
        PaymentMethodController.createPaymentMethod
    )
    .put(
        "/",
        AuthMiddleware,
        AccessControl("admin"),
        PaymentMethodController.updatePaymentMethod
    )
    .delete(
        "/",
        AuthMiddleware,
        AccessControl("admin"),
        PaymentMethodController.deletePaymentMethod
    );

export { router as PaymentMethodRoutes };
