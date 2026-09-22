import { MONGODB_URI } from "./database";
import session, { MemoryStore } from "express-session";
import mongoDbSession from "connect-mongodb-session";
import type { Player } from "./types";
const MongoDBStore = mongoDbSession(session);

const mongoStore = new MongoDBStore({
    uri: MONGODB_URI,
    collection: "sessions",
    databaseName: "login-express",
});

declare module 'express-session' {
    export interface SessionData {
        player: Player
    }
}

export default session({
    secret: process.env.SESSION_SECRET ?? "my-super-secret-secret",
    store: mongoStore,
    resave: true,
    saveUninitialized: true
});