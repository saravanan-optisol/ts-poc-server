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
const Products_1 = __importDefault(require("../../models/Products"));
const router = express_1.default.Router();
const express_validator_1 = require("express-validator");
const Profile_1 = __importDefault(require("../../models/Profile"));
const auth_1 = __importDefault(require("../../middleware/auth"));
router.post('/', [
    auth_1.default,
    [
        (0, express_validator_1.check)('location', 'location is required').not().isEmpty(),
        (0, express_validator_1.check)('address', 'address is required').not().isEmpty(),
        (0, express_validator_1.check)('mobile', 'mobile is required').not().isEmpty(),
    ],
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: [{ msg: errors.array() }] });
    }
    const {} = req.body;
    //build profiles
    const profileFields = {};
    profileFields.user = req.user.id;
    profileFields.location = req.body.location;
    profileFields.address = req.body.address;
    profileFields.mobile = req.body.mobile;
    try {
        let profile = yield Profile_1.default.findOne({ user: req.user.id });
        if (profile) {
            //update
            profile = yield Profile_1.default.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true });
            return res.json(profile);
        }
        //create
        profile = new Profile_1.default(profileFields);
        yield profile.save();
        res.json(profile);
    }
    catch (err) {
        res.status(500).send('<api/profile.js>server error');
    }
}));
//get profile by id
router.get('/', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let profile = yield Profile_1.default.findOne({ user: req.user.id });
        if (!profile) {
            res.status(404).json({ errors: [{ msg: 'profile not there' }] });
        }
        res.json(profile);
    }
    catch (err) {
        res.status(500).send('<api/profile.js>server error');
    }
}));
//add to cart
router.put('/add/:p_id', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let profile = yield Profile_1.default.findOne({ user: req.user.id });
        let product = yield Products_1.default.findById(req.params.p_id);
        if (!profile) {
            const profileFields = {
                user: req.user.id,
            };
            profile = new Profile_1.default(profileFields);
        }
        //check if the product already in the cart
        if (profile.cart.filter((item) => item.product.toString() === req.params.p_id)
            .length > 0) {
            return res
                .status(400)
                .json({ errors: [{ msg: 'product already in the cart' }] });
        }
        const profileFields = {
            product: req.params.p_id,
            name: product.name,
            imgsrc: product.imgsrc,
            prize: product.prize,
        };
        profile.cart.unshift(profileFields);
        yield profile.save();
        res.json(profile);
    }
    catch (err) {
        res.status(500).send('server error');
    }
}));
//remove product from cart
router.put('/remove/:p_id', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let profile = yield Profile_1.default.findOne({ user: req.user.id });
        //check if the product in the cart
        if (profile.cart.filter((item) => item._id.toString() === req.params.p_id)
            .length === 0) {
            return res.status(400).json({ errors: [{ msg: 'product not exists' }] });
        }
        //get remvoe index
        const removeIndex = profile.cart
            .map((item) => item._id.toString())
            .indexOf(req.params.p_id);
        profile.cart.splice(removeIndex, 1);
        yield profile.save();
        res.json(profile);
    }
    catch (err) {
        res.status(500).send('server error');
    }
}));
//get all cart products by user id
router.get('/cart', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let profile = yield Profile_1.default.findOne({ user: req.user.id });
        if (!profile) {
            res.status(404).json({ errors: [{ msg: 'product not found' }] });
        }
        res.json(profile);
    }
    catch (err) {
        res.status(500).send('server error');
    }
}));
module.exports = router;
