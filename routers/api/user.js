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
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const gravatar_1 = __importDefault(require("gravatar"));
const User_1 = __importDefault(require("../../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_validator_1 = require("express-validator");
// @route POST api/User
// @desc Register User
// @access public
router.post('/', [
    (0, express_validator_1.check)('name', 'name is required').not().isEmpty(),
    (0, express_validator_1.check)('email', 'please enter valid email').isEmail(),
    (0, express_validator_1.check)('password', 'give the password').isLength({ min: 6 }),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
        let user = yield User_1.default.findOne({ email });
        if (user) {
            return res
                .status(400)
                .json({ errors: [{ msg: 'email already exists' }] });
        }
        const avatar = gravatar_1.default.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm',
        });
        user = new User_1.default({
            name,
            email,
            avatar,
            password,
        });
        const salt = yield bcryptjs_1.default.genSalt(10);
        user.password = yield bcryptjs_1.default.hash(password, salt);
        yield user.save();
        //return json webtoken
        //res.send('User ruote -Registerd');
        const payload = {
            user: {
                id: user.id,
            },
        };
        jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
            if (err)
                throw err;
            res.json({ token });
        });
    }
    catch (err) {
        console.log(err.message);
        return res.status(500).send('server Error, <api/user.js>' + err.message);
    }
}));
module.exports = router;
