import type { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

export function secureMiddleware(req: Request, res: Response, next: NextFunction) {
    let token : string = req.cookies.jwt;
    jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
        if (err) {
            res.redirect("/login");
        } else {
            res.locals.user = user;
            next();
        }
    });
};