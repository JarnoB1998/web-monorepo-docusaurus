import express, { type Express } from "express";
import { connect } from "./database";
import { pizzaRouter } from "./routers/pizzaRouter";
import cors, { type CorsOptions } from "cors";

const app: Express = express();
app.set("port", Number(process.env.PORT ?? 3000));
const corsOptions: CorsOptions = {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type"]
};
app.use(cors(corsOptions));
app.use(express.json());
app.use("/", pizzaRouter());

async function main(): Promise<void> {
    try {
        await connect();
        app.listen(app.get("port"), (): void => {
            console.log("Server gestart op http://localhost:" + app.get("port"));
        });
    } catch (error: unknown) {
        console.error(error);
        process.exitCode = 1;
    }
}

main();
