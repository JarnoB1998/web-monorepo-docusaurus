import express, { type Express } from "express";
import dotenv from "dotenv";
import path from "path";
import utilMiddleware from "./middleware/utilMiddleware";
import session from "./session";
import homeRouter from "./router/homeRouter";
import loginRouter from "./router/loginRouter";
import { loginMiddleware } from "./middleware/loginMiddleware";
import cookieParser from "cookie-parser";
import { beersRouter } from "./router/beersRouter";
import { barsRouter } from "./router/barsRouter";
import profileRouter from "./router/profileRouter";
import { flashMiddleware } from "./middleware/flashMiddleware";

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

app.use("/", loginRouter());
app.use("/", loginMiddleware, homeRouter());
app.use("/profile", loginMiddleware, profileRouter());
app.use("/beers", loginMiddleware, beersRouter());
app.use("/bars", loginMiddleware, barsRouter());

export default app;