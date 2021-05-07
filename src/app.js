import express from "express";
const app = express();
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import "./database";
import path from "path";
import { UserRoutes, ProductRoutes } from "./routes";

app.use(cors());
app.use(helmet());
app.use(morgan("combined"));

app.use(express.static(path.join(__dirname, "/../public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", UserRoutes);
app.use("/products", ProductRoutes);

export default app;
