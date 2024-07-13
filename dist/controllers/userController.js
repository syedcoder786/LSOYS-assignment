"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAddress = exports.getMe = exports.loginUser = exports.registerUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const userModel_1 = __importDefault(require("../models/userModel"));
// Generate JWT
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.jwtSecret, {
        expiresIn: '30d',
    });
};
// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, address } = req.body;
    if (!name || !email || !password || !address) {
        res.status(400).json({ message: 'Please provide name, email, password and address' });
        return;
    }
    // Check if user exists
    const userExists = yield userModel_1.default.findOne({ email });
    if (userExists) {
        res.status(400).json({ message: 'Email already exists' });
        return;
    }
    // Hash password
    const salt = yield bcryptjs_1.default.genSalt(10);
    const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
    // Create user
    const user = yield userModel_1.default.create({
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
    }
    else {
        res.status(400).json({ message: 'Invalid user data' });
        throw new Error('Invalid user data');
    }
}));
exports.registerUser = registerUser;
// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // Check for user email
    const user = yield userModel_1.default.findOne({ email });
    if (user && (yield bcryptjs_1.default.compare(password || "", user.password || ""))) {
        const token = generateToken(user._id || "");
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            address: user.address,
            profile_img: user.profile_img,
            token: token,
        });
    }
    else {
        res.status(400).json({ message: 'Invalid credentials' });
        throw new Error('Invalid credentials');
    }
}));
exports.loginUser = loginUser;
// @desc    Add address to user
// @route   POST /api/users/address
// @access  Private
const addAddress = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { address } = req.body;
    try {
        yield userModel_1.default.findByIdAndUpdate(req.user._id, { address });
        const updatedUser = yield userModel_1.default.findById(req.user._id);
        if (updatedUser) {
            const token = generateToken(updatedUser._id);
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                address: updatedUser.address,
                token: token,
            });
        }
        else {
            res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}));
exports.addAddress = addAddress;
// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findById(req.user._id);
    if (user) {
        res.json(user);
    }
    else {
        res.status(404).json({ message: 'User not found' });
    }
}));
exports.getMe = getMe;
