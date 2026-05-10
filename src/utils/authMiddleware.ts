import jwt from "jsonwebtoken";
import config from "config";
import { Request, Response, NextFunction } from "express";

// extend express request interface to include user property so TS doesn't complain when we set req.user in the auth middleware
declare global {
  namespace Express {
    interface Request {
      user?: { userID: string; isAdministrator?: boolean };
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const privateKey = config.get<string>("session.tokenKey");

    jwt.verify(token, privateKey, { algorithms: ["HS256"] }, (err, decodedToken) => {
      if (err) {
        res.status(500).json({ error: "Not Authorized" });
        return;
      }
      req.user = decodedToken as { userID: string; isAdministrator?: boolean };
      return next();
    });
  } else {
    res.status(500).json({ error: "Not Authorized" });
    return;
  }
}
