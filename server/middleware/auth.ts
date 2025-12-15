import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const { JWT_SECRET = "dev-secret" } = process.env;

type JwtPayload = {
  sub: string;
  role: string;
};

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const user = await User.findById(payload.sub).lean();
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error", err);
    return res.status(401).json({ error: "Unauthorized" });
  }
}

export function requireRole(role: string) {
  return function roleMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}
