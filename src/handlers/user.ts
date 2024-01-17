import { comparePasswords, createJWT, hashPassword } from "../utils/auth";
import prisma from "../utils/db";
import { NextFunction, Request, Response } from "express";
import { ProjectError } from "./errors";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const createNewUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        password: await hashPassword(req.body.password),
      },
    });
    const token = createJWT(user);
    res.json({ token });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      next(error);
    }
    next(
      new ProjectError({
        type: "SIGN_IN_FAIL_ERROR",
        message: "Something went wrong during auth, try again",
        cause: error,
      })
    );
  }
};

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        username: req.body.username,
      },
    });
    const isValid = await comparePasswords(req.body.password, user.password);
    if (!isValid) {
      next(
        new ProjectError({
          type: "AUTH_FAIL_ERROR",
          message: "Invalid username or password",
        })
      );
    }
    const token = createJWT(user);
    res.send({ token });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      next(error);
    }
    next(
      new ProjectError({
        type: "AUTH_FAIL_ERROR",
        message: "Something went wrong during auth",
        cause: error,
      })
    );
  }
};
