import session from "../session"
import type { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

export function loginMiddleware(req: Request, res: Response, next: NextFunction) {
    let token : string = req.cookies.jwt;
    jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
        if (typeof user === "string" || user === undefined) {
            return res.redirect("/login");
        }
        if (err) {
            return res.redirect("/login");
        } else {
            res.locals.user = user;
            next();
        }
    });
}