import express from "express";
const router = express.Router();
import { UserController } from "../controllers";
import { AuthMiddleware } from "../middlewares";

router
    .get("/authenticate", AuthMiddleware, UserController.authenticate)
    .post("/login", UserController.login)
    .post("/register", UserController.register);

export { router as UserRoutes };
