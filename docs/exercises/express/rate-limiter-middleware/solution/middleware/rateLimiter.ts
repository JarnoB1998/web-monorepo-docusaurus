import { type Request, type Response, type NextFunction } from 'express';

let requestLog : Record<string, number> = {};

interface RateLimiterConfig {
    timeWindow: number;
}

export const rateLimiter = (config: RateLimiterConfig) => {
    return (req: Request, res: Response, next: NextFunction) => {
        console.log(`${req.ip} ${req.method} ${req.path}`);
        if (req.ip) {
            let previous: number = requestLog[req.ip] ?? 0;
            requestLog[req.ip] = new Date().getTime();

            if (requestLog[req.ip] - previous < config.timeWindow) {
                res.status(429).send(`Too many requests. You can do only one request per ${config.timeWindow/1000} seconds.`);
                return;
            }

        }

        next();
    };
};