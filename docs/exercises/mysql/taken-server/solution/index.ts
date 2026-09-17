import express, { Express } from "express";
import { connect } from "./database";
import { takenRouter } from "./routers/takenRouter";

const app: Express = express();
app.set("port", Number(process.env.PORT ?? 3000));
app.use(express.json());
app.use("/", takenRouter());

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
