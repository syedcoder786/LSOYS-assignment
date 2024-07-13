import express from "express";
const router = express.Router();
import {
  addProduct,
  fetchProducts,
  fetchOneProduct,
  rentProduct,
} from "../controllers/productController";

import { protect } from "../middleware/authMiddleware.js";

router.route("/").post(protect, addProduct);

router.route("/rentProduct").post(protect, rentProduct);

router.route("/fetchProducts").post(fetchProducts);

router.route("/fetchOneProduct").post(fetchOneProduct)

export default router;
