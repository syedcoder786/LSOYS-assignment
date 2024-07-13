import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import User, { IUser } from '../models/userModel';

interface AuthRequest extends Request {
  user?: IUser; // Extend Request interface to include optional user property
}

// Generate JWT
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.jwtSecret as string, {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, address } :IUser = req.body;

  if (!name || !email || !password || !address) {
    res.status(400).json({ message: 'Please provide name, email, password and address' } as { message: string });
    return;
  }

  // Check if user exists
  const userExists = await User.findOne({ email });


  if (userExists) {
    res.status(400).json({ message: 'Email already exists' } as { message: string });
    return;
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    address,
    profile_img: "https://flowbite.com/docs/images/people/profile-picture-5.jpg",
  });

  if (user) {
    const token = generateToken(user._id);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      profile_img: user.profile_img,
      token: token,
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' } as { message: string });
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } : IUser = req.body;

  // Check for user email
  const user: IUser | null = await User.findOne({ email });

  if (user && (await bcrypt.compare(password || "", user.password || ""))) {
    const token = generateToken(user._id || "");
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      profile_img: user.profile_img,
      token: token,
    });
  } else {
    res.status(400).json({ message: 'Invalid credentials' } as { message: string });
    throw new Error('Invalid credentials');
  }
});

// @desc    Add address to user
// @route   POST /api/users/address
// @access  Private
const addAddress = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { address }: IUser = req.body;

  try {
    await User.findByIdAndUpdate(req.user!._id, { address });

    const updatedUser = await User.findById(req.user!._id);

    if (updatedUser) {
      const token = generateToken(updatedUser._id);
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        address: updatedUser.address,
        token: token,
      });
    } else {
      res.status(404).json({ message: 'User not found' } as { message: string });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message } as { message: string });
  }
});

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user!._id);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' } as { message: string });
  }
});

export { registerUser, loginUser, getMe, addAddress };
