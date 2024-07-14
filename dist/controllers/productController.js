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
exports.rentProduct = exports.fetchOneProduct = exports.fetchUserRentedProducts = exports.fetchProducts = exports.addProduct = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const productModel_1 = __importDefault(require("../models/productModel"));
// Add Product
const addProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { imageUrl, title, price, description } = req.body;
    const owner = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const newProduct = yield productModel_1.default.create({
            owner,
            imageUrl,
            title,
            price,
            description,
        });
        const oneProduct = yield productModel_1.default.findById(newProduct._id);
        console.log(oneProduct);
        res.status(200).json(oneProduct);
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}));
exports.addProduct = addProduct;
// Fetch All Products
const fetchProducts = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productItems = yield productModel_1.default.find().sort('-createdAt')
            .populate("owner");
        // console.log(productItems);
        res.status(200).json(productItems);
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}));
exports.fetchProducts = fetchProducts;
// Fetch User Rented Products
const fetchUserRentedProducts = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const productItems = yield productModel_1.default.find({ "renterDetails.renter": (_a = req.user) === null || _a === void 0 ? void 0 : _a.id })
            .sort('-updatedAt')
            .populate("owner")
            .populate("renterDetails.renter");
        // console.log(productItems);
        res.status(200).json(productItems);
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}));
exports.fetchUserRentedProducts = fetchUserRentedProducts;
// Fetch One Product
const fetchOneProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.body;
        const productOne = yield productModel_1.default.findOne({ _id: productId });
        // console.log(productOne);
        res.status(200).json(productOne);
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}));
exports.fetchOneProduct = fetchOneProduct;
// Rent Product
const rentProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id, days } = req.body;
    const renter = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const newProduct = yield productModel_1.default.findOneAndUpdate({ _id: id }, {
            renterDetails: {
                renter,
                days
            },
            available: false
        });
        if (newProduct) {
            const oneProduct = yield productModel_1.default.findById(newProduct._id)
                .populate("owner")
                .populate("renterDetails.renter");
            res.status(200).json(oneProduct);
        }
        else {
            res.status(400).json({ message: 'Product not in database' });
        }
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}));
exports.rentProduct = rentProduct;
