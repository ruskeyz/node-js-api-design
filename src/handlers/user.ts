import { comparePasswords, createJWT, hashPassword } from "../utils/auth";
import prisma from "../utils/db";
import { Request, Response } from "express";

export const createNewUser = async (req: Request, res: Response) => {
  const user = await prisma.user.create({
    data: {
      username: req.body.username,
      password: await hashPassword(req.body.password),
    },
  });
  const token = createJWT(user);
  res.json({ token });
};

export const signin = async (req: Request, res: Response) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      username: req.body.username,
    },
  });
  const isValid = await comparePasswords(req.body.password, user.password);
  if (!isValid) {
    res.status(401);
    res.send({
      code: 401,
      message: "Invalid username or password",
    });
  }
  const token = createJWT(user);
  res.send({ token });
};
