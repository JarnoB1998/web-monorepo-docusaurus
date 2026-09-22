import type { Request, Response, NextFunction } from "express";

export function flashMiddleware(req: Request, res: Response, next: NextFunction) {
    res.locals.message = req.session.message;
    req.session.message = undefined;
    next();
}