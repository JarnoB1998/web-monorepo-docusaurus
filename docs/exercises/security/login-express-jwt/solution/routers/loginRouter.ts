import express from "express";
import { login } from "../database";
import { secureMiddleware } from "../middleware/secureMiddleware";
import type { User } from "../types";
import * as jwt from 'jsonwebtoken';

export function loginRouter() {
    const router = express.Router();

    router.get("/login", async (req, res) => {
        res.render("login");
    });

    router.post("/login", async (req, res) => {
        const email: string = req.body.email;
        const password: string = req.body.password;
        try {
            let user: User = await login(email, password);
            delete user.password; // Remove password from user object. Sounds like a good idea.
            
            const token = jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: "7d" });
            res.cookie("jwt", token, { httpOnly: true, sameSite: "lax", secure: true });
            req.session.message = { type: "success", message: "Login successful" };
            res.redirect("/")
        } catch (e: any) {
            req.session.message = { type: "error", message: e.message };
            res.redirect("/login");
        }
    });

    router.post("/logout", secureMiddleware, async (req, res) => {
        res.clearCookie("jwt");
        res.redirect("/login");
    });

    return router;
}