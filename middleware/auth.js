"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = () => {
    return (req, res, next) => {
        //get token from header
        const token = req.header('x-auth-token');
        //check its token
        if (!token) {
            return res
                .status(401)
                .json({ msg: '<midware/auth.js>user not autherized' });
        }
        //verify the token
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            req.user = decoded.user;
            next();
        }
        catch (err) {
            res.status(401).json({ msg: '<midware/auth.js>Token not valid' });
        }
    };
};
exports.default = auth;
