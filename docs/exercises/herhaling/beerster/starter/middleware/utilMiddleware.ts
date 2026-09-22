import type { Request, Response, NextFunction } from "express";

export default function utilMiddleware(req: Request, res: Response, next: NextFunction) {
    res.locals.formatDateTime = (date: string) => {
            return new Date(date).toLocaleString("nl-BE");
    }
    next();
}