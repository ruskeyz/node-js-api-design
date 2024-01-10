import { Router } from "express";
import { body } from "express-validator";
import handleInputErrors from "./utils/handleInputErrors";
import { validateUpdateProductInput } from "./validators/validators";
import {
  createProduct,
  deleteProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
} from "./handlers/product";
import {
  createUpdate,
  deleteUpdate,
  getSingleUpdate,
  getUpdates,
  updateUpdate,
} from "./handlers/update";

const router = Router();

// Product
router.get("/product", getProducts);
router.get("/product/:id", getSingleProduct);
router.put(
  "/product/:id",
  body("name").isString(),
  handleInputErrors,
  updateProduct
);
router.post(
  "/product/",
  body("name").isString(),
  handleInputErrors,
  createProduct
);
router.delete("/product/:id", deleteProduct);

// Update
router.get("/update", getUpdates);
router.get("/update/:id", getSingleUpdate);
router.put(
  "/update/:id",
  validateUpdateProductInput,
  handleInputErrors,
  updateUpdate
);
router.post(
  "/update/",
  body("title").exists().isString(),
  body("body").exists().isString(),
  body("productId").exists().isString(),
  createUpdate
);
router.delete("/update/:id", deleteUpdate);

// Update Point
router.get("/updatepoint", () => {});
router.get("/updatepoint/:id", () => {});
router.put(
  "/updatepoint/:id",
  body("name").optional().isString(),
  body("description").optional().isString(),
  () => {}
);
router.post("/updatepoint/", () => {});
router.delete("/updatepoint/:id", () => {});

export default router;
