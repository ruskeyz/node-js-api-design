import { Router } from "express";
import { body } from "express-validator";
import handleInputErrors from "./utils/handleInputErrors";
import { validateUpdateProductInput } from "./validators/validators";
import { getProducts, getSingleProduct } from "./handlers/product";

const router = Router();

// Product
router.get("/product", getProducts);
router.get("/product/:id", getSingleProduct);
router.put(
  "/product/:id",
  body("name").isString(),
  handleInputErrors,
  () => {}
);
router.post("/product/", body("name").isString(), handleInputErrors, () => {});
router.delete("/product/:id", () => {});

// Update
router.get("/update", () => {});
router.get("/update/:id", () => {});
router.put(
  "/update/:id",
  validateUpdateProductInput,
  handleInputErrors,
  (req, res) => {}
);
router.post(
  "/update/",
  body("title").exists().isString(),
  body("body").exists().isString(),
  () => {}
);
router.delete("/update/:id", () => {});

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
