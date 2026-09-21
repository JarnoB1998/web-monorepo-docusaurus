import { type Request, type Response, type NextFunction } from 'express';

export function ejsUtility(req: Request, res: Response, next: NextFunction) {
    res.locals.caesar = (str: string, shift: number) => {
        return str.split('').map((char: string) => {
            let code = char.charCodeAt(0);
            if (code >= 65 && code <= 90) {
                code = ((code - 65 + shift) % 26) + 65;
            } else if (code >= 97 && code <= 122) {
                code = ((code - 97 + shift) % 26) + 97;
            }
            return String.fromCharCode(code);
        }).join('');
    }
    res.locals.reverse = (str: string) => {
        return str.split('').reverse().join('');
    }
    res.locals.shorten = (str: string, len: number) => {
        return str.length > len ? str.substring(0, len) + '...' : str;
    }
    next();
}