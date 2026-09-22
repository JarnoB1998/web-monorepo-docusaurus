import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express, { type Express } from "express";
import path from "path";
import { flashMiddleware } from "./middleware/flashMiddleware";
import utilMiddleware from "./middleware/utilMiddleware";
import session from "./session";

dotenv.config();

const app : Express = express();

app.set("view engine", "ejs");
app.use(session);
app.use(flashMiddleware);
app.use(cookieParser());
app.use(utilMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

app.set("port", process.env.PORT ?? 3000);

export default app;