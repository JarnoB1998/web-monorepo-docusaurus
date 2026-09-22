import session from "../session"
import type { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

export function loginMiddleware(req: Request, res: Response, next: NextFunction) {
    next();
}