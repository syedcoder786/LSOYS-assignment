import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Product, { IProduct, IRenterDetails } from '../models/productModel';
import { IUser } from '../models/userModel';

interface AuthRequest extends Request {
  user?: IUser; // Extend Request interface to include optional user property
}

// Add Product
const addProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { imageUrl, title, price, description }: Partial<IProduct> = req.body;
  const owner = req.user?.id

  try {
    const newProduct = await Product.create({
      owner,
      imageUrl,
      title,
      price,
      description,
    });

    const oneProduct = await Product.findById(newProduct._id);

    console.log(oneProduct);

    res.status(200).json(oneProduct);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
        res.status(400).json({ message: error.message });
    } else {
        res.status(500).json({ message: 'Internal Server Error' });
    }
  }
});

// Fetch All Products
const fetchProducts = asyncHandler(async (req: Request, res: Response) => {
  try {
    const productItems = await Product.find().sort('-createdAt')
    .populate("owner");

    // console.log(productItems);
    res.status(200).json(productItems);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
        res.status(400).json({ message: error.message });
    } else {
        res.status(500).json({ message: 'Internal Server Error' });
    }
  }
});

// Fetch One Product
const fetchOneProduct = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { productId } = req.body;

    const productOne = await Product.findOne({ _id: productId });

    // console.log(productOne);
    res.status(200).json(productOne);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
        res.status(400).json({ message: error.message });
    } else {
        res.status(500).json({ message: 'Internal Server Error' });
    }
  }
});

// Rent Product
const rentProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id, days } = req.body;
  const renter = req.user?.id

  try {
    const newProduct = await Product.findOneAndUpdate(
      { _id: id },
      { 
        renterDetails: {
          renter,
          days
        },
        available: false
      }
    );

    if(newProduct){
      const oneProduct = await Product.findById(newProduct._id)
      .populate("owner")
      .populate("renterDetails.renter");
      res.status(200).json(oneProduct);
    }else{
      res.status(400).json({ message: 'Product not in database' });
    }

  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
        res.status(400).json({ message: error.message });
    } else {
        res.status(500).json({ message: 'Internal Server Error' });
    }
  }
});

export { addProduct, fetchProducts, fetchOneProduct, rentProduct };
