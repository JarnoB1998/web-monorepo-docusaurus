import express from "express";
import { login } from "../database";
import type { User } from "../types";
import session from "../session";
import * as jwt from "jsonwebtoken";

export default function loginRouter() {
    const router = express.Router();

    router.get("/login", (req, res) => {
        res.render("login");
    });

    router.post("/login", async(req, res) => {
        try {
            const username : string = req.body.username;
            const password : string = req.body.password;
            const user : User = await login(username, password);

            delete user.password;
            const token = jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: "7d" });

            console.log(user);
            res.cookie("jwt", token, { httpOnly: true, sameSite: "lax", secure: true });
            res.redirect("/");
        } catch (e : any) {
            req.session.message = { message: e.message, type: "error" };
            res.redirect("/login");
        }
    });

    router.get("/logout", (req, res) => {
        res.clearCookie("jwt");
        res.redirect("/login")
    });

    return router;
}