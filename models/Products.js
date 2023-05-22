"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ProductSchema = new Schema({
    category: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    productName: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    prize: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    information: {
        type: String,
        required: true,
    },
    imgsrc: {
        type: String,
        required: true,
    },
    reviews: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users',
            },
            rating: {
                type: Number,
                required: true,
            },
            comment: {
                type: String,
            },
            name: {
                type: String,
            },
            avatar: {
                type: String,
            },
            date: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    date: {
        type: Date,
        default: Date.now,
    },
});
const Product = mongoose_1.default.model('product', ProductSchema);
exports.default = Product;
