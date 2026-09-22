import type { Request, Response, NextFunction } from "express";


export function secureMiddleware(req: Request, res: Response, next: NextFunction) {
    if (!req.session.player) {
        res.redirect("/");
    } else {
        res.locals.player = req.session.player;
        next();
    }
}