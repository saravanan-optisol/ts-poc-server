"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schema = mongoose_1.default.Schema;
const ProfileSchema = new schema({
    user: {
        type: schema.Types.ObjectId,
        ref: 'users',
    },
    location: {
        type: String,
    },
    mobile: {
        type: Number,
    },
    address: {
        type: String,
    },
    cart: [
        {
            product: {
                type: schema.Types.ObjectId,
                ref: 'produts',
            },
            name: {
                type: String,
            },
            imgsrc: {
                type: String,
            },
            prize: {
                type: Number,
            },
            date: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    orders: [
        {
            product: {
                type: schema.Types.ObjectId,
                ref: 'produts',
            },
            date: {
                type: Date,
                default: Date.now,
            },
        },
    ],
});
const Profile = mongoose_1.default.model('profile', ProfileSchema);
exports.default = Profile;
