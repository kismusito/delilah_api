import express from "express";
const router = express.Router();
import { PaymentMethodController } from "../controllers";
import { AuthMiddleware } from "../middlewares";

router
    .get("/", PaymentMethodController.getPaymentMethods)
    .get("/:id", PaymentMethodController.getPaymentMethod)
    .post("/", AuthMiddleware, PaymentMethodController.createPaymentMethod)
    .put("/", AuthMiddleware, PaymentMethodController.updatePaymentMethod)
    .delete("/", AuthMiddleware, PaymentMethodController.deletePaymentMethod);

export { router as PaymentMethodRoutes };
