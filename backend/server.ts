import express from "express"
const app = express();
import dotenv from "dotenv"
dotenv.config()
import cors from "cors";
app.use(cors());
import connectDB from "./config/db.js";
connectDB();
import {errorHandler} from './middleware/errorMiddleware.js'


const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

import userRoutes from "./routes/userRoutes.js";
app.use("/api/users", userRoutes);
import productRoutes from "./routes/productRoutes.js";
app.use("/api/product", productRoutes);
// import cartRoutes from "./routes/cartRoutes.js";
// app.use("/api/cart", cartRoutes);
// import orderRoutes from "./routes/orderRoutes.js"
// app.use('/api/order', orderRoutes);

app.use(errorHandler)

app.listen(port, () => console.log(`Server started on port ${port}`.bold));
