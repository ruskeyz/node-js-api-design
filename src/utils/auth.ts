import { User } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";

export const createJWT = (user: User) => {
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET as string
  );
  return token;
};

export const protect = (
  req: Request & { user?: JwtPayload },
  res: Response,
  next: NextFunction
) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    res.status(401);
    res.json({
      code: 401,
      message: "Not authorised",
    });
    return;
  }

  const [, token] = bearer.split(" ");

  if (!token) {
    res.status(401);
    res.json({
      code: 401,
      message: "Not authorised",
    });
    return;
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    req.user = payload;
    next();
  } catch (e) {
    console.error(e);
    res.status(401);
    res.json({
      code: 401,
      message: "Wrong token",
    });
    return;
  }
};

export const comparePasswords = (password: string, hash: string) =>
  bcrypt.compare(password, hash);

export const hashPassword = (password: string) => bcrypt.hash(password, 5);
