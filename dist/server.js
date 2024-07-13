"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
app.use((0, cors_1.default)());
const db_js_1 = __importDefault(require("./config/db.js"));
(0, db_js_1.default)();
const errorMiddleware_js_1 = require("./middleware/errorMiddleware.js");
const port = process.env.PORT || 5000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
const userRoutes_js_1 = __importDefault(require("./routes/userRoutes.js"));
app.use("/api/users", userRoutes_js_1.default);
const productRoutes_js_1 = __importDefault(require("./routes/productRoutes.js"));
app.use("/api/product", productRoutes_js_1.default);
// import cartRoutes from "./routes/cartRoutes.js";
// app.use("/api/cart", cartRoutes);
// import orderRoutes from "./routes/orderRoutes.js"
// app.use('/api/order', orderRoutes);
app.use(errorMiddleware_js_1.errorHandler);
app.listen(port, () => console.log(`Server started on port ${port}`.bold));
