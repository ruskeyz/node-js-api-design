import { NextFunction, Request, Response } from "express";
import prisma from "../utils/db";
import { Update } from "@prisma/client";
import { ProjectError } from "./errors";

export const getUpdates = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        belongsToId: req.user.id,
      },
      include: {
        updates: true,
      },
    });
    // Well this is REST :clown
    const updates = products.reduce((allUpdates: Update[], product) => {
      return [...allUpdates, ...product.updates];
    }, []);

    res.json({ data: updates });
  } catch (error) {
    next(
      new ProjectError({
        type: "UPDATE_NOT_FOUND_ERROR",
        message: "No updates from this user",
        cause: error,
      })
    );
  }
};

export const getSingleUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const update = await prisma.update.findUnique({
      where: {
        id: req.params.id,
      },
    });
    if (!update) {
      next(
        new ProjectError({
          type: "UPDATE_NOT_FOUND_ERROR",
          message: "No updates with this id",
        })
      );
    }
    res.json({ data: update });
  } catch (error) {
    next(
      new ProjectError({
        type: "UPDATE_NOT_FOUND_ERROR",
        message: "Update not found, try again",
        cause: error,
      })
    );
  }
};

export const updateUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        belongsToId: req.user.id,
        //updates: {
        //in: [""],
        //},
        //only find product, with id, only updates that match req.params
      },
      include: {
        //TODO this needs to be refactored, use prisma IN method
        updates: true,
      },
    });

    const updates = products.reduce((allUpdates: Update[], product) => {
      return [...allUpdates, ...product.updates];
    }, []);

    const match = updates.find((update) => update.id === req.params.id);
    if (!match) {
      return res.json({ message: "Not found update" });
    }

    const updatedUpdate = await prisma.update.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });

    res.json({ data: updatedUpdate });
  } catch (error) {
    next(
      new ProjectError({
        type: "UPDATE_NOT_UPDATED_ERROR",
        message: "Cannot update this update",
        cause: error,
      })
    );
  }
};

export const createUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: req.body.productId,
      },
    });

    if (!product) {
      next(
        new ProjectError({
          type: "PRODUCT_NOT_FOUND_ERROR",
          message: "No product found with this id",
        })
      );
    } else {
      const newUpdate = await prisma.update.create({
        data: {
          title: req.body.title,
          body: req.body.body,
          product: { connect: { id: product.id } },
        },
      });
      res.json({ data: newUpdate });
    }
  } catch (error) {
    next(
      new ProjectError({
        type: "UPDATE_NOT_CREATED_ERROR",
        message: "Update did not create, try again",
        cause: error,
      })
    );
  }
};

export const deleteUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        id: req.body.productId,
      },
      include: {
        updates: true,
      },
    });

    const updates = products.reduce((allUpdates: Update[], product) => {
      return [...allUpdates, ...product.updates];
    }, []);

    const match = updates.find((update) => update.id === req.params.id);

    if (!match) {
      next(
        new ProjectError({
          type: "UPDATE_NOT_FOUND_ERROR",
          message: "Update not found",
        })
      );
    }
    const deleted = await prisma.update.delete({
      where: {
        id: req.params.id,
      },
    });

    res.json({ data: deleted });
  } catch (error) {
    next(
      new ProjectError({
        type: "UPDATE_NOT_DELETED_ERROR",
        message: "Update could not be deleted, try again",
        cause: error,
      })
    );
  }
};
