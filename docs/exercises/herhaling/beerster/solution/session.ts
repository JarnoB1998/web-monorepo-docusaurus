import { MONGODB_URI } from "./database";
import session from "express-session";
import mongoDbSession from "connect-mongodb-session";
import type { FlashMessage } from "./types";
const MongoDBStore = mongoDbSession(session);

const mongoStore = new MongoDBStore({
    uri: MONGODB_URI,
    collection: "sessions",
    databaseName: "beerster",
});

declare module "express-session" {
    export interface SessionData {
        username: string;
        message: FlashMessage;
    }
}

export default session({
    secret: process.env.SESSION_SECRET ?? "my-super-secret-secret",
    store: mongoStore,
    resave: true,
    saveUninitialized: true
});