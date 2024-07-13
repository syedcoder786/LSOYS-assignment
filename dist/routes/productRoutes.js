"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const productController_1 = require("../controllers/productController");
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
router.route("/").post(authMiddleware_js_1.protect, productController_1.addProduct);
router.route("/rentProduct").post(authMiddleware_js_1.protect, productController_1.rentProduct);
router.route("/fetchProducts").post(productController_1.fetchProducts);
router.route("/fetchOneProduct").post(productController_1.fetchOneProduct);
exports.default = router;
