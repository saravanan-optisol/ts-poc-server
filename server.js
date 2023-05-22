"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const connectdb = require('./config/mongo');
require('dotenv').config();
const mongodb_user = process.env.MONGO_USER;
const mongodb_auth = process.env.MONGO_AUTH;
const db_url = `mongodb+srv://${mongodb_user}:${mongodb_auth}@cluster0.rukzr.mongodb.net/`;
//mongo connection
connectdb(db_url);
//init middleware
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
//Define routes
app.use('/api/register', require('./routers/api/user'));
app.use('/api/auth', require('./routers/api/auth'));
app.use('/api/profile', require('./routers/api/profile'));
app.use('/private/product', require('./routers/private/products'));
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
    console.log('Server Started...');
});
